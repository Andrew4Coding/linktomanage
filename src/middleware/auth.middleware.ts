import type { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { AppError } from "../common/error.js";

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        throw new AppError("Authorization header is missing", 401);
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
        await verify(jwtToken, process.env.JWT_SECRET as string)
    }
    catch {
        throw new AppError("Unauthorized", 401);
    }

    await next();
}