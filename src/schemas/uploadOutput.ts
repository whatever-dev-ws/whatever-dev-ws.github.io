import { z } from 'astro/zod';

export const uploadOutputSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  outputFile: z
    .instanceof(File, { message: 'An image file is required' })
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type),
      'File must be an image (PNG, JPEG, WebP, or GIF)',
    ),
});

export type UploadOutputFormData = z.infer<typeof uploadOutputSchema>;
