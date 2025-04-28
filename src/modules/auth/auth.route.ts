import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { successResponse } from "../../common/response.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { login, register } from "./auth.service.js";

const app = new Hono();

app.post("/login",
    zValidator("json", loginSchema),
    async (c) => { 
        const {email, password} = c.req.valid("json");
        const responseData = await login(email, password);

        return successResponse(c, responseData, "Login successful", 200);
})

app.post("/register",
    zValidator("json", registerSchema),
    async (c) => {
        const { email, password, name } = c.req.valid("json");
        
        const responseData = await register(email, password, name);

        return successResponse(c, responseData, "Registration successful", 201);
})

export default app;