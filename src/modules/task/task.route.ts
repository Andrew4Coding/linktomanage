import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { successResponse } from "../../common/response.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import type { authenticatedRoute } from "../../types.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";
import { createTask, deleteTask, getAllTasks, getSingleTask, updateTask } from "./task.service.js";

const app = new Hono<authenticatedRoute>()

app.use(authMiddleware);

app.get('/', (c) => {
    const user = c.get("user");
    const query = c.req.query();

    const responseData = getAllTasks(user.id, query);

    return successResponse(c, responseData, "Successfully get all tasks");
})

app.get('/:id', async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");

    const responseData = await getSingleTask(user.id, id);

    return successResponse(c, responseData, `Successfully get task with id ${id}`);
})

app.post('/',
    zValidator("json", createTaskSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await createTask(user.id, body);

        return successResponse(c, responseData, "Successfully create task", 201);
    })

app.put('/:id',
    zValidator("json", updateTaskSchema),
    async (c) => {
        const { id } = c.req.param();

        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await updateTask(user.id, id, body);

        return successResponse(c, responseData, `Successfully update task with id ${id}`);
    })

app.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");

    const responseData = await deleteTask(user.id, id);

    return successResponse(c, responseData, `Successfully delete task with id ${id}`);
})

export default app;
