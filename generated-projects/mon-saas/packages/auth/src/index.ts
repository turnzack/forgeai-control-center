import type { Role } from '@forgeai/contracts';

export const permissions: Record<Role, readonly string[]> = { owner: ['*'], admin: ['org:read', 'org:write', 'billing:read', 'team:write'], developer: ['org:read', 'usage:read'], viewer: ['org:read'] };
export function can(role: Role, permission: string) { return permissions[role].includes('*') || permissions[role].includes(permission); }
