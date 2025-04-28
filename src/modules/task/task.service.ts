import { AppError } from "@/common/error.js";
import type { filterParams } from "@/types.js";
import prisma from "prisma/prisma.js";
import type { createBulkTasksType, createTaskType, deleteTasksType, updateTaskType } from "./task.schema.js";

export async function getAllTasks(userId: string, query?: filterParams) {
    const { page = 1, limit = 5, search = "", ...filters } = query || {};
    const skip = (page - 1) * limit;

    const data = await prisma.task.findMany({
        where: {
            userId,
            title: {
                contains: search,
                mode: "insensitive"
            },
            ...filters
        },
        skip,
        take: Number(limit),
        orderBy: {
            createdAt: "desc"
        }
    });

    return data;
}

export async function getSingleTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId
        }
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return task;
}

export async function createTask(userId: string, task: createTaskType) {
    const { tags, ...rest } = task;
    const newTask = await prisma.task.create({
        data: {
            userId,
            TaskTag: {
                connect: tags?.map(tag => ({
                    name: tag
                }))
            },
            ...rest
        }
    }).catch((error) => {
        console.log(error);
        throw new AppError("Failed to create task", 500);
    });
        

    return newTask;
}

export async function createTasks(userId: string, body: createBulkTasksType) {
    const newTasks = await Promise.all(
        body.tasks.map(async (task) => {
            const { tags, ...rest } = task;
            return await prisma.task.create({
                data: {
                    userId,
                    ...rest,
                    TaskTag: {
                        connect: tags?.map(tag => ({
                            name: tag
                        }))
                    }
                }
            });
        })
    ).catch((error) => {
        console.log(error);
        throw new AppError("Failed to create tasks", 500);
    });

    return newTasks;
}

export async function updateTask(userId: string, taskId: string, task: updateTaskType) {
    const { tags, ...rest } = task;
    const updatedTask = await prisma.task.update({
        where: {
            id: taskId,
            userId
        },
        data: {
            ...rest,
            TaskTag: {
                connect: tags?.map(tag => ({
                    name: tag
                }))
            }
        }
    });

    if (!updatedTask) {
        throw new AppError("Task not found", 404);
    }

    return updatedTask;
}

export async function deleteTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId
        }
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const deletedTask = await prisma.task.delete({
        where: {
            id: taskId,
            userId
        }
    });

    return deletedTask;
}

export async function deleteTasks(userId: string, body: deleteTasksType) {
    const tasks = await prisma.task.findMany({
        where: {
            id: {
                in: body.tasks
            },
            userId
        }
    });

    if (tasks.length === 0) {
        throw new AppError("No tasks found to delete", 404);
    }

    const deletedTasks = await prisma.task.deleteMany({
        where: {
            id: {
                in: body.tasks
            },
            userId
        }
    });

    if (deletedTasks.count === 0) {
        throw new AppError("No tasks found to delete", 404);
    }

    return deletedTasks;
}