import { AppError } from "@/common/error.js";
import argon2 from "argon2";
import { sign } from "hono/jwt";
import prisma from "@db/prisma.js";

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    }

    const token = await sign(
        payload,
        process.env.JWT_SECRET as string,
    )

    return {
        ... payload,
        token,
    };
}

export async function register(email: string, password: string, name: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (user) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    const payload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    }

    const token = await sign(
        payload,
        process.env.JWT_SECRET as string,
    )

    return {
        ... payload,
        token,
    };
}