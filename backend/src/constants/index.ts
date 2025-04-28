import {z} from "zod";


// ? SCHEMA FOR X'S POSTS
export const XPostSchema = z.object({
    title:z.string().max(100) , 
    content:z.string() , 
    image:z.array(z.string().optional()) , 
    hashtags:z.array(z.string().optional()) , 
    isPosted:z.boolean().optional(),
})

export type XPostinput = z.infer<typeof XPostSchema>;


// ? SCHEMA FOR LLM PROCESSING REQUEST
export const LLMProcessingRequestSchema = z.object({
    model:z.string() , 
    messages:z.array(z.object({
        role:z.string() ,
        content:z.string()
    }))
})

export type LLMProcessingRequestInput = z.infer<typeof LLMProcessingRequestSchema>;

