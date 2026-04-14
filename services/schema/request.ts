import { z } from 'zod';

export const createRequestSchema = z.object({
    client_id: z.string(),
    method: z.string(),
    path: z.string(),
    headers: z.string(),
    queries: z.string(),
    body: z.string(),
})

export type CreateRequestSchema = z.infer<typeof createRequestSchema>