import { z } from "zod";
import { PasswordSchema } from "./password.schema";

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(10, "Display name must be less than 10 characters"),
});

export type DisplayNameForm = z.infer<typeof displayNameSchema>;

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: PasswordSchema,
  confirmNewPassword: z.string().min(1, "Confirm new password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;