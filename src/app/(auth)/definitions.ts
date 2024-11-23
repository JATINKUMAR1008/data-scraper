import { z } from "zod";
export const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password must not be empty." }),
});

export const SingUpSchema = z.object({
  firstName: z.string().min(1, { message: "Name must not be empty." }),
  lastName: z.string().min(1, { message: "Name must not be empty." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});
export const OrganizationSchema = z.object({
  orgName: z
    .string()
    .min(1, { message: "Organization name must not be empty." }),
});

export type FormState =
  | {
      error?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        orgName?: string[];
      };
      message?: string;
    }
  | undefined;
