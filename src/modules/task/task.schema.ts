import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "../../../prisma/generated/index.js";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.nativeEnum(TASK_STATUS).default("PENDING"),
    priority: z.nativeEnum(TASK_PRIORITY).optional(),
    dueDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
})

export type createTaskType = z.infer<typeof createTaskSchema>;