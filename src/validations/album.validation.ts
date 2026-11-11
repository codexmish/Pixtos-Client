import z from "zod";

// -----create album validation (same rules as backend)
export const createAlbumSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title is required")
    .max(100, "title max 100 caracters long"),
  description: z
    .string("Description must be text")
    .trim()
    .max(500, "description max 500 caracters long"),
});
