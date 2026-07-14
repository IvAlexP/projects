import { z } from "zod";
import { cardSchema } from "./card.schema";

export const infoSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
});

export const setSchema = infoSchema.extend({
  cards: z.array(cardSchema).min(1, "At least one card is required."),
});

export type InfoValues = z.infer<typeof infoSchema>;
export type SetFormValues = z.infer<typeof setSchema>;