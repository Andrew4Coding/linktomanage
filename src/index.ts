import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import app from './app.js';

const index = new Hono();

index.route('/api/v1', app);

serve({
  fetch: index.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
