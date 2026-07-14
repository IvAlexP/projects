import { z } from "zod";

export const PasswordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password is not strong enough")
  .regex(/[a-z]/, "Password is not strong enough")
  .regex(/[A-Z]/, "Password is not strong enough")
  .regex(/[0-9]/, "Password is not strong enough")
  .regex(/[^a-zA-Z0-9]/, "Password is not strong enough");

export type PasswordForm = z.infer<typeof PasswordSchema>;

export const rules = [
  { regex: /[a-z]/, label: "at least 1 lowercase letter" },
  { regex: /[A-Z]/, label: "at least 1 uppercase letter" },
  { regex: /[0-9]/, label: "at least 1 number" },
  { regex: /[^a-zA-Z0-9]/, label: "at least 1 symbol" },
  { regex: /^.{8,}$/, label: "at least 8 characters" },
];
