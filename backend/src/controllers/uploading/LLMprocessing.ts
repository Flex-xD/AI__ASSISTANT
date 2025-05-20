import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import { Request, Response } from "express";
import { config } from "dotenv";
import { personalityContext } from "../../constants";
config();

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});


export const LLMprocessingForX = async (req: Request, res: Response) => {
    const { prompt } = req.body as { prompt: string };

    if (!prompt || prompt.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Prompt is required",
            success: false,
        });
    }

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


