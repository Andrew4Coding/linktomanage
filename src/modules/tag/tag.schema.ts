import { z } from "zod";

export const createSingleTagSchema = z.object({
    name: z.string().min(1, "Name is required"),
})

export const createBulkTagsSchema = z.object({
    tags: z.array(
        z.string().min(1, "Name is required"),
    ),
}).refine((data) => {
    return data.tags.length > 0;
}, {
    message: "At least one tag is required",
});

export const updateTagSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
}).refine((data) => {
    return Object.keys(data).length > 0;
}
    , {
        message: "At least one field is required to update",
    });


export const deleteBulkTagsSchema = z.object({
    tags: z.array(
        z.string().min(1, "Name is required"),
    ),
}).refine((data) => {
    return data.tags.length > 0;
}, {
    message: "At least one tag is required",
});

export type createTagType = z.infer<typeof createSingleTagSchema>;
export type createTagsType = z.infer<typeof createBulkTagsSchema>;
export type updateTagType = z.infer<typeof updateTagSchema>;
export type deleteTagsType = z.infer<typeof deleteBulkTagsSchema>;