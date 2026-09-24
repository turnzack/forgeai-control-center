import { z } from "zod";
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- DRIZZLE ORM SCHEMAS (SQLite / D1) ---
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('member'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at')
});

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: text('created_at').notNull()
});

// --- D1 SCHEMA DEFINITIONS (Types & Zod) ---

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["admin", "member", "guest"]).default("member"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  ownerId: z.string().uuid(),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  createdAt: z.string().datetime(),
});

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;

// Input schemas for API creation
export const CreateUserSchema = UserSchema.pick({ email: true, name: true, role: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const CreateWorkspaceSchema = WorkspaceSchema.pick({ name: true, ownerId: true, plan: true });
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
