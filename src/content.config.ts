import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workshops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workshops' }),
  schema: z.object({
    title: z.string(),
    remoteAssetsSlug: z
      .string()
      .min(1, { message: 'Remote assets slug cannot be empty.' })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          'Slug must contain only lowercase alphanumeric characters and hyphens (not starting or ending with hyphen, and no consecutive hyphens).',
      }),
    isActive: z.boolean(),
  }),
});

export const collections = {
  workshops,
};
