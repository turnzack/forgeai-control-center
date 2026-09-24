import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { drizzle } from 'drizzle-orm/d1';
import { users, workspaces } from '../../src/models/schema';
import { eq, sql } from 'drizzle-orm';

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>().basePath('/api');

// Middleware basique pour logger
app.use('*', async (c, next) => {
  console.log(`[API] ${c.req.method} ${c.req.url}`);
  await next();
});

// Route de santé
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Récupérer les stats globales (pour le Dashboard)
app.get('/stats', async (c) => {
  const db = drizzle(c.env.DB);
  
  try {
    // Dans un vrai cas, on ferait des COUNT() réels
    // const usersCount = await db.select({ count: sql`count(*)` }).from(users);
    
    return c.json({
      success: true,
      stats: {
        activeUsers: '8,234',
        revenue: '45,231 €',
        apiRequests: '1.2M',
        realtime: true
      }
    });
  } catch (error) {
    return c.json({ success: false, error: 'Database error' }, 500);
  }
});

// API Utilisateurs
app.get('/users', async (c) => {
  const db = drizzle(c.env.DB);
  try {
    const allUsers = await db.select().from(users).limit(50);
    return c.json({ success: true, data: allUsers });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

app.post('/users', async (c) => {
  const db = drizzle(c.env.DB);
  try {
    const body = await c.req.json();
    // A l'avenir: validation Zod stricte ici
    
    const result = await db.insert(users).values({
      email: body.email,
      name: body.name,
      createdAt: new Date().toISOString()
    }).returning();
    
    return c.json({ success: true, data: result[0] }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to create user' }, 500);
  }
});

export const onRequest = handle(app);
