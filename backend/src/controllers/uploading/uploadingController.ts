import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import { Request, Response } from "express";
import { config } from "dotenv";
config();

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});
export const tweetUploading = async (req: Request, res: Response) => {
    try {
        const {tweetText} = req.body as {tweetText:string};
        if (!tweetText || tweetText.trim() === "") {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "AI did not return valid tweet content.",
            });
        }
        const tweetResponse = await twitterClient.v2.tweet(tweetText);
        
        console.log("Tweet posted successfully !");
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tweet posted successfully!",
            tweet: tweetResponse,
        });

    } catch (error: any) {
        console.error("Error while uploading tweet:", error.message || error);
        console.log({error})
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to upload tweet.",
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};
