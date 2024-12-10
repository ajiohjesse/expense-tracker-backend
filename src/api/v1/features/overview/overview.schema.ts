import { z } from 'zod';

export const OverviewQuerySchema = z.object({
    date: z.string().optional()
});
