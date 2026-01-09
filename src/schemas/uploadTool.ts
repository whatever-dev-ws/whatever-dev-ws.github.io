import { z } from 'astro/zod';

export const uploadToolSchema = z.object({
  toolName: z.string().min(1, 'Tool name is required').trim(),
  toolDescription: z.string().min(1, 'Description is required').trim(),
  nickname: z.string().min(1, 'Nickname is required').trim(),
  modelUsed: z.string().min(1, 'Model used is required').trim(),
  toolFile: z
    .instanceof(File, { message: 'A JavaScript file is required' })
    .refine((file) => file.name.endsWith('.js'), 'File must be a JavaScript file (.js)'),
});

export type UploadToolFormData = z.infer<typeof uploadToolSchema>;
