import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const app = new Hono()

app.use(authMiddleware);

export default app;
