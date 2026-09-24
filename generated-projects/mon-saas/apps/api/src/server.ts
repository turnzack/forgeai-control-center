import Fastify from 'fastify';
import { healthResponse } from '@forgeai/contracts';

const app = Fastify({ logger: true });
app.get('/health', async () => healthResponse.parse({ status: 'ok', service: 'api' }));
app.get('/v1/me', async (_request, reply) => reply.code(501).send({ error: 'authentication_not_configured' }));

const port = Number(process.env.API_PORT ?? 3001);
app.listen({ port, host: '0.0.0.0' }).catch((error) => { app.log.error(error); process.exit(1); });
