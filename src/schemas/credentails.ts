import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;