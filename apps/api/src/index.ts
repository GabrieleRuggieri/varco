/**
 * Entry point API — skeleton fase 1.
 * L'implementazione NestJS completa arriverà nella fase API skeleton.
 */
import { createServer } from 'node:http';
import { MVP_VERSION } from '@varco/shared';

const port = Number(process.env.API_PORT ?? 3001);

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      service: '@varco/api',
      status: 'ok',
      mvpVersion: MVP_VERSION,
      message: 'Skeleton API — implementazione NestJS in fase successiva',
    }),
  );
});

server.listen(port, () => {
  console.log(`[api] in ascolto su http://localhost:${port}`);
});
