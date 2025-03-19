"use server";

import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { encrypt } from "@/lib/encryption";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schemas/credentails";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCredentials(values: createCredentialSchemaType) {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const { success, data } = createCredentialSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input");
  }

  const encryptedValue = await encrypt(data.value);

  await db.insert(credentialsTable).values({
    name: data.name,
    value: encryptedValue,
    userId: user.id,
  });

  revalidatePath("/credentials");
}
