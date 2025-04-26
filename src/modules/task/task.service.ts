import { AppError } from "@/common/error.js";
import prisma from "prisma/prisma.js";
import type { filterParams } from "../../types.js";
import type { createTaskType, updateTaskType } from "./task.schema.js";

export async function getAllTasks(userId: string, query?: filterParams) {
    const { page = 1, limit = 5, filters } = query || {};
    const skip = (page - 1) * limit;

    const data = await prisma.task.findMany({
        where: {
            userId,
            ... filters
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    })

    return data;
}

export async function getSingleTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId
        }
    })

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return task;
}

export async function createTask(userId: string, task: createTaskType) {
    const newTask = await prisma.task.create({
        data: {
            userId,
            ...task,
        }
    })

    return newTask;

}

export async function updateTask(userId: string, taskId: string, task: updateTaskType) { 
    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
            userId
        },
        data: {
            ...task
        }
    })

    if (!updatedTask) {
        throw new AppError("Task not found", 404);
    }

    return updatedTask;
}

export async function deleteTask(userId: string, taskId: string) {
    const deletedTask = await prisma.task.delete({
        where: {
            id: taskId,
            userId
        }
    })

    if (!deletedTask) {
        throw new AppError("Task not found", 404);
    }

    return deletedTask;
}