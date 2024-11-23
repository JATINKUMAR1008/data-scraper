import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export type SessionPayload = {
  userId: string | number;
  expiresAt?: Date;
};

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  // redirect("/dashboard");
}

export async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/signin");
  }

  return { isAuth: true, userId: Number(session.userId) };
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }
  try {
    const data = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, session.userId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    if (!data) {
      return null;
    }
    const user = data;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
});