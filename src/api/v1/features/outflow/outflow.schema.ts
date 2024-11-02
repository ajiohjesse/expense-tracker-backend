import { z } from 'zod';

//TODO: add queries for amount range and date range
export const OutflowQuerySchema = z.object({
    categoryId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional()
});

export const OutflowParamsSchema = z.object({
    outflowId: z.coerce.number()
});

export const OutflowBodySchema = z.object({
    amount: z.number().min(1),
    categoryId: z.string(),
    description: z.string().optional()
});
