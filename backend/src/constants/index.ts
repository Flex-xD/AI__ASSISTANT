import { z } from "zod";


// ? SCHEMA FOR X'S POSTS
export const XPostSchema = z.object({
    title: z.string().max(100),
    content: z.string(),
    image: z.array(z.string().optional()),
    hashtags: z.array(z.string().optional()),
    isPosted: z.boolean().optional(),
})

export type XPostinput = z.infer<typeof XPostSchema>;


// ? SCHEMA FOR LLM PROCESSING REQUEST
export const LLMProcessingRequestSchema = z.object({
    model: z.string(),
    messages: z.array(z.object({
        role: z.string(),
        content: z.string()
    }))
})

export type LLMProcessingRequestInput = z.infer<typeof LLMProcessingRequestSchema>;


// Personality context used as a system message to steer the tone of the response
export const personalityContext = `
You are an AI assistant helping Aman, a driven 17-year-old developer passionate about coding and personal growth. Aman loves simplicity in learning but enjoys digging deep into complex tech. He balances his coding grind with gym workouts, candle gazing, and creating emotional and educational content online.
He shares his daily progress and projects on social media with a warm, authentic, and motivational tone. 
Today, Aman wants to post on X (Twitter). Generate a short, catchy, platform-native tweet based on his prompt that reflects his style and enthusiasm.
Use relevant hashtags that would help his tweet reach the right tech or coding audience and try to keep the response human like.
`;


export type mediaIdtype = [string] | [string, string] | [string, string, string] | [string, string, string, string]
