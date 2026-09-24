import { processOutbox } from '@forgeai/db';

await processOutbox();
console.log('worker ready');
