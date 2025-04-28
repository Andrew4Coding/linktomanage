import { successResponse } from "@/common/response.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";
import type { authenticatedRoute } from "@/types.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBulkTagsSchema, createSingleTagSchema, deleteBulkTagsSchema, updateTagSchema } from "./tag.schema.js";
import { createTag, createTags, deleteTag, deleteTags, getAllTags, getSingleTag, updateTag } from "./tag.service.js";

const app = new Hono<authenticatedRoute>();

app.use(authMiddleware);

app.get('/', async (c) => {
    const user = c.get("user");
    const query = c.req.query();

    const responseData = await getAllTags(user.id, query);

    return successResponse(c, responseData, "Successfully get all tags");
});

app.get('/:id', async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");

    const responseData = await getSingleTag(user.id, id);

    return successResponse(c, responseData, `Successfully get tag with id ${id}`);
});

app.post('/single',
    zValidator("json", createSingleTagSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await createTag(user.id, body);

        return successResponse(c, responseData, "Successfully create tag", 201);
    });

app.post('/bulk',
    zValidator("json", createBulkTagsSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await createTags(user.id, body);

        return successResponse(c, responseData, "Successfully create tags", 201);
    });

app.patch('/:id',
    zValidator("json", updateTagSchema),
    async (c) => {
        const { id } = c.req.param();
        const body = c.req.valid("json");
        const user = c.get("user");
        
        const responseData = await updateTag(user.id, id, body);
        return successResponse(c, responseData, `Successfully update tag with id ${id}`);
    });

app.delete('/single/:id', async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const responseData = await deleteTag(user.id, id);
    return successResponse(c, responseData, `Successfully delete tag with id ${id}`);
});

app.delete('/bulk',
    zValidator("json", deleteBulkTagsSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = c.get("user");

        const responseData = await deleteTags(user.id, body);

        return successResponse(c, responseData, "Successfully delete tags");
    });

export default app;