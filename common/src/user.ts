import {z} from 'zod'

export const signupSchema=z.object({
    email:z.string().email(),
    name:z.string().optional(),
    password:z.string().min(6),
})
export const signinSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
})
export type signupType=z.infer<typeof signupSchema>
export type signinType=z.infer<typeof signinSchema>