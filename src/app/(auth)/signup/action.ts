"use server";

import { db } from "@/db";
import { FormState, SingUpSchema } from "../definitions";
import { eq } from "drizzle-orm";
import { authMethods, UserBalance, usersTable } from "@/db/schema";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
export const signUp = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  // Implement your logic here
  const validateFields = SingUpSchema.safeParse({
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }
  const errorMessage = "User already exists";
  // Check if user already exists
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, validateFields.data.email),
  });
  if (existingUser) {
    return {
      message: errorMessage,
    };
  }
  // Create user
  const user = await db
    .insert(usersTable)
    .values({
      email: validateFields.data.email,
      firstName: validateFields.data.firstName,
      lastName: validateFields.data.lastName,
    })
    .returning({
      id: usersTable.id,
    });

  // Create user password
  const hashedPassword = await bcrypt.hash(validateFields.data.password, 10);
  await db.insert(authMethods).values({
    userId: user[0].id!,
    passwordHash: hashedPassword,
    provider: "email",
  });
  await db.insert(UserBalance).values({
    userId: user[0].id!,
    credits: 0,
  });
  await createSession(user[0].id.toString());
  redirect("/welcome");
};
