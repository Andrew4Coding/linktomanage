import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import app from './app.js';
import { notFoundHandler } from './helper/notfound.handler.js';

const index = new Hono();

index.route('/api/v1', app);
index.notFound(notFoundHandler)

serve({
  fetch: index.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
