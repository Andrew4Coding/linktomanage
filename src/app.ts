import { Hono } from "hono";
import { errorHandler } from "./helper/error.handler.js";
import { logHandler } from "./helper/log.handler.js";
import task from './modules/task/task.route.js';

const app = new Hono();

app.onError(errorHandler)

app.use("*", logHandler);

app.route('/task', task);

app.get('/healthcheck', (c) => { 
    return c.text('OK');
});


export default app;