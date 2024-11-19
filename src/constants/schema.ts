import { z } from "zod";
import { zfd } from "zod-form-data";
import { MAX_UPLOAD_SIZE } from "./data";

// =============================================================================================================================================

export const schemaCreatePostForm = z.object({
  description: z.string().min(1, "La description est requise."),
  tags: z.string().optional(),
  file: z
    .instanceof(File, {
      message: "Merci de bien vouloir insérer un média.",
    })
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, { message: "Votre fichier doit faire moins de 100Mb." })
    .refine(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
      "Seules les images et les vidéos sont acceptées."
    ),
});

export const schemaCreatePostFormData = zfd.formData({ ...schemaCreatePostForm.shape, creatorId: zfd.text() });

// =============================================================================================================================================
