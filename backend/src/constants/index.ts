import {z} from "zod";

export const XPostSchema = z.object({
    title:z.string().max(100) , 
    content:z.string() , 
    image:z.array(z.string().optional()) , 
    hashtags:z.array(z.string().optional()) , 
    isPosted:z.boolean().optional(),
})

export type XPostinput = z.infer<typeof XPostSchema>;

