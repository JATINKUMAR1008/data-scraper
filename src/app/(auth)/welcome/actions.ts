"use server";

import { FormState, OrganizationSchema } from "../definitions";
import { db } from "@/db";
import {
  organizationsTable,
  rolesTable,
  userRoles,
  usersTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/sessions";
import { redirect } from "next/navigation";

export async function createOrg(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  console.log(formData);
  const validateFields = OrganizationSchema.safeParse({
    orgName: formData.get("orgName") as string,
  });
  const errorMessage = { message: "Organization name already exists." };
  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }
  const org = await db.query.organizationsTable.findFirst({
    where: eq(organizationsTable.name, validateFields.data.orgName),
  });
  if (org) {
    return errorMessage;
  }
  const newOrg = await db
    .insert(organizationsTable)
    .values({
      name: validateFields.data.orgName,
    })
    .returning({
      insertedId: organizationsTable.id,
    });
  const user = await getUser();
  console.log(user);
  
  const role = await db
    .insert(rolesTable)
    .values({
      name: "ADMIN",
    })
    .returning({
      roleId: rolesTable.id,
    });
  await db.insert(userRoles).values({
    userId: user?.id!,
    organizationId: newOrg[0].insertedId,
    roleId: role[0].roleId,
  });

  await db
    .update(usersTable)
    .set({
      isNew: false,
    })
    .where(eq(usersTable.id, user?.id!));

  redirect("/");
}
