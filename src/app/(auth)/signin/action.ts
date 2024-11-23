"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { authMethods, usersTable } from "@/db/schema";
import { FormState, SignInSchema } from "../definitions";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/sessions";
import {
  generateState,
  generateCodeVerifier,
  OAuth2RequestError,
} from "oslo/oauth2";
import { Google } from "arctic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  console.log(formData);
  const validateFields = SignInSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  const errorMessage = { message: "Invalid email or password." };
  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, validateFields.data.email),
  });
  if (!user) {
    return errorMessage;
  }
  const hashedPassword = await db.query.authMethods.findFirst({
    where: eq(authMethods.userId, user.id),
    columns: {
      passwordHash: true,
    },
  });
  const passwordMatch = bcrypt.compare(
    validateFields.data.password,
    hashedPassword?.passwordHash || ""
  );
  if (!passwordMatch) {
    return errorMessage;
  }
  const userId = user.id.toString();
  await createSession(userId);
  if (user.isNew) {
    redirect("/welcome");
  } else {
    redirect("/");
  }
}

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_APP_URL + "/auth/callback"
);

export async function generateGoogleAuthorizationURL() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // console.log("state", state);
  // console.log("codeVerifier", codeVerifier);

  // Store state and code verifier in secure, encrypted cookies
  (
    await // Store state and code verifier in secure, encrypted cookies
    cookies()
  ).set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60, // 10 minutes
  });

  (await cookies()).set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60, // 10 minutes
  });

  const authorizationURL = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  return authorizationURL.toString();
}

export async function handleGoogleCallback(searchParams: URLSearchParams) {
  const storedState = (await cookies()).get("google_oauth_state")?.value;
  const storedCodeVerifier = (await cookies()).get(
    "google_code_verifier"
  )?.value;
  console.log("storedState", storedState);
  console.log("storedCodeVerifier", storedCodeVerifier);
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  if (!storedState || !state || storedState !== state) {
    throw new Error("Invalid state");
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code!,
      storedCodeVerifier!
    );
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      //@ts-expect-error not added type of token
      { headers: { Authorization: `Bearer ${tokens.data?.access_token}` } }
    );
    const googleUser = await googleUserResponse.json();
    console.log("googleUser", googleUser);

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, googleUser.email),
    });
    (await cookies()).delete("google_oauth_state");
    (await cookies()).delete("google_code_verifier");
    if (existingUser) {
      await createSession(existingUser.id.toString());
      return existingUser;
    }

    const user = await db
      .insert(usersTable)
      .values({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
      })
      .returning({
        isNew: usersTable.isNew,
        id: usersTable.id,
      });
    console.log("user", user);

    await createSession(user[0].id.toString());

    await db.insert(authMethods).values({
      userId: user[0].id!,
      providerU_ID: googleUser.sub,
      provider: "google",
      passwordHash: "",
    });

    return user[0];
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      console.error("OAuth Error:", error);
      throw new Error("Authentication failed");
    }
    throw error;
  }
}

export const signInByGoogle = async () => {
  const url = await generateGoogleAuthorizationURL();
  return url;
};
