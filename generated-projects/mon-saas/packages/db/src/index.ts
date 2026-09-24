export interface OrganizationRepository { getById(id: string): Promise<unknown | null>; }
export async function processOutbox() { return { processed: 0 }; }
