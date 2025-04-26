import type { Context, Next } from "hono";
import { verify } from "hono/jwt";
import prisma from "prisma/prisma.js";
import { AppError } from "../common/error.js";
import type { authPayload } from "../types.js";

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        throw new AppError("Authorization header is missing", 401);
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
        const data = await verify(jwtToken, process.env.JWT_SECRET as string)
        const payload: authPayload = {
            id: data.id as string,
            email: data.email as string,
            name: data.name as string,
        };

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if (!user) {
            throw new AppError("User not found", 401);
        }

        c.set("user", payload);
    }
    catch {
        throw new AppError("Unauthorized", 401);
    }

    await next();
}