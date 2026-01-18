import type { ZodIssue } from 'astro/zod';

export type Tool = {
  id: string;
  author: string;
  name: string;
  description: string;
  model: string;
  url: string;
  uploadedAt: string;
};

export type Output = {
  id: string;
  toolId: string;
  toolUrl: string;
  url: string;
  createdAt: string;
};

export type Manifest = {
  tools: Tool[];
  outputs: Output[];
};

export type ValidationErrorResponse = { success: false; error: { issues: ZodIssue[] } };

export type GeneralErrorResponse = { success: false; error: { message: string } };

export type ErrorResponse = ValidationErrorResponse | GeneralErrorResponse;
