import { z } from "zod";
import { zfd } from "zod-form-data";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_SIZE } from "./data";

// =============================================================================================================================================

export const schemaUpdateProfileForm = z.object({
  name: z.string().min(1, "Le nom est requis."),
  username: z.string().min(1, "Le nom d'utilisateur est requis."),
  bio: z.string().optional(),
});

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

export const schemaEditPostForm = z.object({
  description: z.string().min(1, "La description est requise."),
  tags: z.string().optional(),
});

// =============================================================================================================================================

export const schemaUpdateProfileImageForm = z.object({
  image: z
    .instanceof(File, {
      message: "Merci de bien vouloir insérer une image !",
    })
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_IMAGE_SIZE;
    }, "Votre image doit faire moins de 15MB")
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file?.type as string);
    }, "Votre image doit être de type : PNG / JPG / JPEG / WEBP / SVG"),
});

export const schemaUpdateProfileImageFormData = zfd.formData(schemaUpdateProfileImageForm);

// =============================================================================================================================================

export const schemaSettingsCardVisibilityForm = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]),
});

// =============================================================================================================================================

export const schemaNewCommentForm = z.object({
  content: z
    .string()
    .min(1, "Le commentaire est requis.")
    .max(1000, "Le commentaire doit faire moins de 1000 caractères."),
});

export const schemaNewCommentFormJson = z.object({
  ...schemaNewCommentForm.shape,
  postId: z.string(),
  userId: z.string(),
});

// =============================================================================================================================================

export const schemaSearchForm = z.object({
  q: z
    .string()
    .min(1, "Veuilez rechercher quelque chose.")
    .max(5, "Veuillez limiter votre recherche à 5 caractères maximum."),
});

// =============================================================================================================================================
