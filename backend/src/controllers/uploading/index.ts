import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import { Request, Response } from "express";
import { config } from "dotenv";

// Load environment variables
config();

// Validate required environment variables

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

/**
 * Controller function to upload a tweet using AI generated content.
 */
export const tweetUploading = async (req: Request, res: Response) => {
    const { prompt } = req.body as { prompt: string };

    // Input validation for prompt
    if (!prompt || prompt.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Prompt is required and cannot be empty.",
        });
    }

    // Personality context used for generating tweet text
    const personalityContext = `
        You are an AI assistant helping Aman, a driven 17-year-old developer passionate about coding and personal growth. 
        Aman loves simplicity in learning but enjoys digging deep into complex tech. He balances his coding grind with gym workouts, candle gazing, and creating emotional and educational content online.
        He shares his daily progress and projects on social media with a warm, authentic, and motivational tone.
        Today, Aman wants to post on X (Twitter). Generate a short, catchy, platform-native tweet based on his prompt that reflects his style and enthusiasm.
        Use relevant hashtags that would help his tweet reach the right tech or coding audience.
    `;

    try {
        // Request AI to generate tweet content
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    { role: 'system', content: personalityContext.trim() },
                    { role: 'user', content: prompt.trim() },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract tweet text from LLM response
        const tweetText = response.data.choices[0]?.message?.content?.trim();

        // Handle case where AI did not return valid tweet text
        if (!tweetText) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "AI did not return valid tweet content.",
            });
        }

        // Post the generated tweet to Twitter
        const tweetResponse = await twitterClient.v2.tweet(tweetText);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tweet posted successfully!",
            tweet: tweetResponse,
        });

    } catch (error: any) {
        // Log the error for better debugging
        console.error("Error while uploading tweet:", error.message || error);

        // Return appropriate error response
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to upload tweet.",
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};


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
    Use relevant hashtags that would help his tweet reach the right tech or coding audience and try to keep the response human like.
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


