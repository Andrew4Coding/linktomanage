import { AppError } from "@/common/error.js";
import type { filterParams } from "@/types.js";
import prisma from "@db/prisma.js";
import type { createTagsType, createTagType, deleteTagsType, updateTagType } from "./tag.schema.js";

export async function getAllTags(userId: string, query?: filterParams) { 
    const { page = 1, limit = 5, search = "", ... filters } = query || {};
    const skip = (page - 1) * limit;

    const tags = await prisma.taskTag.findMany({
        where: {
            userId,
            name: {
                contains: search,
                mode: "insensitive"
            },
            ...filters
        },
        skip,
        take: Number(limit),
        orderBy: {
            createdAt: "desc"
        },
    }).catch((err) => {
        console.log(err);
        throw new AppError("Failed to get tags", 500);
    })

    return tags;
}

export async function getSingleTag(userId: string, tagId: string) {
    const tag = await prisma.taskTag.findFirst({
        where: {
            id: tagId,
            userId
        },
        include: {
            tasks: true
        }
    })

    if (!tag) {
        throw new AppError("Tag not found", 404);
    }

    return tag;
}

export async function createTag(userId: string, body: createTagType) {
    const existingTag = await prisma.taskTag.findUnique({
        where: {
            name: body.name,
            userId
        }
    })

    if (existingTag) {
        throw new AppError("Tag already exists", 409);
    }

    const tag = await prisma.taskTag.create({
        data: {
            name: body.name,
            userId
        }
    })

    return tag;
}

export async function createTags(userId: string, body: createTagsType) { 
    const existingTags = await prisma.taskTag.findMany({
        where: {
            name: {
                in: body.tags,
            },
            userId
        }
    })
    if (existingTags.length > 0) {
        throw new AppError("Some tags already exist", 409);
    }
    
    const tags = await prisma.taskTag.createMany({
        data: body.tags.map(tag => ({
            name: tag,
            userId
        }))
    })

    return tags;
}

export async function updateTag(userId: string, tagId: string, body: updateTagType) {
    const existingTag = await prisma.taskTag.findUnique({
        where: {
            id: tagId,
            userId
        }
    })

    if (!existingTag) {
        throw new AppError("Tag not found", 404);
    }

    const tag = await prisma.taskTag.update({
        where: {
            id: tagId,
            userId
        },
        data: {
            name: body.name
        }
    })

    return tag;
}

export async function deleteTag(userId: string, tagId: string) {
    const existingTag = await prisma.taskTag.findUnique({
        where: {
            id: tagId,
            userId
        }
    })

    if (!existingTag) {
        throw new AppError("Tag not found", 404);
    }

    const tag = await prisma.taskTag.delete({
        where: {
            id: tagId,
            userId
        }
    })

    return tag;
}

export async function deleteTags(userId: string, body: deleteTagsType) {
    const existingTags = await prisma.taskTag.findMany({
        where: {
            name: {
                in: body.tags,
            },
            userId
        }
    })

    if (existingTags.length === 0) {
        throw new AppError("Tags not found", 404);
    }

    const tags = await prisma.taskTag.deleteMany({
        where: {
            name: {
                in: body.tags,
            },
            userId
        }
    })

    return tags;
}