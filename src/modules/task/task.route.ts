import { successResponse } from "@/common/response.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";
import type { authenticatedRoute } from "@/types.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBulkTasksSchema, createTaskSchema, deleteBulkTasksSchema, updateTaskSchema } from "./task.schema.js";
import { createTask, createTasks, deleteTask, deleteTasks, getAllTasks, getSingleTask, updateTask } from "./task.service.js";

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

app.post('/single',
    zValidator("json", createTaskSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await createTask(user.id, body);

        return successResponse(c, responseData, "Successfully create task", 201);
    })

app.post('/bulk',
    zValidator("json", createBulkTasksSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await createTasks(user.id, body);

        return successResponse(c, responseData, "Successfully create tasks", 201);
    })

app.patch('/:id',
    zValidator("json", updateTaskSchema),
    async (c) => {
        const { id } = c.req.param();

        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await updateTask(user.id, id, body);

        return successResponse(c, responseData, `Successfully update task with id ${id}`);
    })

app.delete('/single/:id', async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");

    const responseData = await deleteTask(user.id, id);

    return successResponse(c, responseData, `Successfully delete task with id ${id}`);
})

app.delete('/bulk',
    zValidator("json", deleteBulkTasksSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await deleteTasks(user.id, body);
        return successResponse(c, responseData, "Successfully delete tasks");
    })

export default app;
