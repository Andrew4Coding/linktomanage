import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import type { authenticatedRoute } from "../../types.js";

const app = new Hono<authenticatedRoute>()

app.use(authMiddleware);

export default app;
