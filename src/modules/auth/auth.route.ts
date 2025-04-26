import { Hono } from "hono";
import { successResponse } from "../../common/response.js";

const app = new Hono();

app.post("/login", (c) => { 
    return successResponse(c, {}, "Login successful");
})

app.post("/register", (c) => { 
    return successResponse(c, {}, "Registration successful", 201);
})

export default app;