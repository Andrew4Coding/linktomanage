import { TASK_PRIORITY, TASK_STATUS } from "prisma/generated/index.js";
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.nativeEnum(TASK_STATUS).default("PENDING"),
    priority: z.nativeEnum(TASK_PRIORITY).optional(),
    dueDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
})

export const createBulkTasksSchema = z.object({
    tasks: z.array(createTaskSchema),
}).refine((data) => {
    return data.tasks.length > 0;
}, {
    message: "At least one task is required",
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    status: z.nativeEnum(TASK_STATUS).optional(),
    priority: z.nativeEnum(TASK_PRIORITY).optional(),
    dueDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
}).refine((data) => {
    return Object.keys(data).length > 0;
}, {
    message: "At least one field is required to update",
});

export const deleteBulkTasksSchema = z.object({
    tasks: z.array(z.string()),
}).refine((data) => {
    return data.tasks.length > 0;
}, {
    message: "At least one task is required",
});

export type createTaskType = z.infer<typeof createTaskSchema>;
export type createBulkTasksType = z.infer<typeof createBulkTasksSchema>;
export type updateTaskType = z.infer<typeof updateTaskSchema>;
export type deleteTasksType = z.infer<typeof deleteBulkTasksSchema>;