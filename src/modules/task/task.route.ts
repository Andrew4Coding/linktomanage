import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { successResponse } from "../../common/response.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import type { authenticatedRoute } from "../../types.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";

const app = new Hono<authenticatedRoute>()

app.use(authMiddleware);

app.get('/', (c) => {
    return successResponse(c, {

    }, "Successfully get all tasks");
})

app.get('/:id', (c) => {
    const { id } = c.req.param();
    return successResponse(c, {
        id
    }, `Successfully get task with id ${id}`);
})

app.post('/',
    zValidator("json", createTaskSchema),
    (c) => {
        const body = c.req.valid("json");

        return successResponse(c, {
        }, "Successfully create task", 201);
    })

app.put('/:id',
    zValidator("json", updateTaskSchema),
    (c) => {
        const { id } = c.req.param();
        const body = c.req.valid("json");

        return successResponse(c, {
            id,
            ...body
        }, `Successfully update task with id ${id}`);
    })
    
app.delete('/:id', (c) => {
    const { id } = c.req.param();

    return successResponse(c, {
        id
    }, `Successfully delete task with id ${id}`);
})

export default app;
