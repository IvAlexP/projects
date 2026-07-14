import { z } from "zod";

export const cardSchema = z.object({
  id: z.number().optional(),
  question: z.string().min(1, "Question is required."),
  answer: z.string().min(1, "Answer is required."),
});

export type CardFormValues = z.infer<typeof cardSchema>;
