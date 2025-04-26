import { Hono } from "hono";
import { errorHandler } from "./helper/error.handler.js";

const app = new Hono();

app.use('*', errorHandler);

app.get('/healthcheck', (c) => { 
    return c.text('OK');
});

export default app;