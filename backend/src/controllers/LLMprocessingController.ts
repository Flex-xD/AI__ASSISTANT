import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const LLMprocessingForX = async (req: Request, res: Response) => {
    try {
        console.log(process.env.OPENROUTER_API_KEY);
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: 'What is the meaning of life?' }],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data);
        return res.status(StatusCodes.OK).json({
            message:"LLM processing successful" , 
            success:true , 
            data:response.data
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

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