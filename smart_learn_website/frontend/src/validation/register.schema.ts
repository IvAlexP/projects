import { z } from "zod";
import { PasswordSchema } from "./password.schema";

export const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterForm = z.infer<typeof registerSchema>;
