import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
import { personalityContext } from "../../constants";
config();

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

        const data = response.data;

        // Try to parse and validate structure
        const content = data?.choices?.[0]?.message?.content || "";
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(content);
        } catch {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "LLM response not in expected JSON format.",
                success: false,
                raw: content,
            });
        }

        const { twitter, reddit, discord } = parsedResponse;

        if (!twitter || !reddit || !discord) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Response missing expected keys (twitter, reddit, discord).",
                success: false,
                raw: parsedResponse,
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "LLM processing successful",
            success: true,
            data: {
                twitter,
                reddit,
                discord
            },
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
