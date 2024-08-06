import { z } from "zod";

export const createBlogSchema=z.object({
    title:z.string(),
    content:z.string(),
})
export const updateBlogSchema=z.object({
    title:z.string().optional(),
    content:z.string().optional(),
})

export type createBlogType=z.infer<typeof createBlogSchema>
export type updateBlogType=z.infer<typeof updateBlogSchema>