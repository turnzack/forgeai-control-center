import { z } from 'zod';

export const roleSchema = z.enum(['owner', 'admin', 'developer', 'viewer']);
export const organizationSchema = z.object({ id: z.string(), name: z.string().min(1), slug: z.string().min(1), planId: z.enum(['starter', 'pro', 'enterprise']), createdAt: z.string() });
export const healthResponse = z.object({ status: z.literal('ok'), service: z.string() });
export type Organization = z.infer<typeof organizationSchema>;
export type Role = z.infer<typeof roleSchema>;
