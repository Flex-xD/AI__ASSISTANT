import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const LLMprocessingForX = async (req: Request, res: Response) => {
    const { prompt } = req.body as { prompt: string };

    if (!prompt || prompt.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Prompt is required",
            success: false,
        });
    }

    // Personality context used as a system message to steer the tone of the response
    const personalityContext = `
    You are an AI assistant helping Aman, a driven 17-year-old developer passionate about coding and personal growth. 
    Aman loves simplicity in learning but enjoys digging deep into complex tech. He balances his coding grind with gym workouts, candle gazing, and creating emotional and educational content online.
    He shares his daily progress and projects on social media with a warm, authentic, and motivational tone. 
    Today, Aman wants to post on X (Twitter). Generate a short, catchy, platform-native tweet based on his prompt that reflects his style and enthusiasm.
    Use relevant hashtags that would help his tweet reach the right tech or coding audience.
    `;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    { role: 'system', content: personalityContext.trim() },
                    { role: 'user', content: prompt.trim() }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.status(StatusCodes.OK).json({
            message: "LLM processing successful",
            success: true,
            data: response.data,
        });

    } catch (error: any) {
        console.error("LLM Error:", error.message || error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            success: false,
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};



export const LLMprocessingForThreads = async (req:Request , res:Response) => {
    try {
        return res.status(StatusCodes.OK).json({
            message:"This is working properly !"
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Internal Server Error"
        })
    }
}