import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import { Request, Response } from "express";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { mediaIdtype } from "../../constants";

config();

export const asyncHandler = ({
    fn(req: Request, res: Response): void {
        
    }
})

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

export const tweetUploading = async (req: Request, res: Response) => {
    try {
        const { tweetText } = req.body as { tweetText: string };

        if (!tweetText || tweetText.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tweet content is required.",
            });
        }

        const files = req.files as Express.Multer.File[] | undefined;
        let mediaIds: string[] = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const mediaBuffer = fs.readFileSync(path.join(file.path));
                const mediaId = await twitterClient.v1.uploadMedia(mediaBuffer, { type: "png" });
                mediaIds.push(mediaId);
                fs.unlinkSync(file.path);
            }
        }

        const tweetResponse = await twitterClient.v2.tweet({
            text: tweetText,
            media: mediaIds.length > 0
                ? { media_ids: mediaIds as mediaIdtype }
                : undefined,
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tweet posted successfully!",
            tweet: tweetResponse,
        });
    } catch (error: any) {
        console.error("Error while uploading tweet:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to upload tweet.",
            error: error?.response?.data || error.message || "Unknown error",
        });
    }
};


export const discordUploading = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.log({ error });
    }
}