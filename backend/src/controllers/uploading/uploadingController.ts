import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import { Request, Response } from "express";
import { config } from "dotenv";
import fs from "fs";
import { ApiError, apiResponse, asyncHandler } from "../../middleware/helperFunctions";
import mime from "mime";

config();

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_KEY_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

export const tweetUploading = asyncHandler(async (req: Request, res: Response) => {
    console.log("Request body:", req.body); 
    console.log("Request files:", req.files); 

    const tweetContent = req.body?.tweetContent as string | undefined;

    if (!tweetContent || tweetContent.trim() === "") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Tweet content is required.");
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const mediaIds: string[] = [];

    if (files?.length) {
        for (const file of files) {
            const mimeType = mime.getType(file.originalname);
            if (!mimeType) {
                fs.unlinkSync(file.path);
                throw new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Unsupported media type");
            }

            const filePath = file.path;
            const buffer = fs.readFileSync(filePath);
            const supportedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

            if (!supportedMimeTypes.includes(mimeType)) {
                fs.unlinkSync(filePath);
                throw new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, `Unsupported file type: ${mimeType}`);
            }

            try {
                const mediaId = await twitterClient.v1.uploadMedia(buffer, { mimeType });
                mediaIds.push(mediaId);
            } catch (error) {
                fs.unlinkSync(file.path);
                console.error("Media upload error:", error);
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to upload media");
            }
            fs.unlinkSync(file.path);
        }
    }

    try {
        const tweetPayload: any = { text: tweetContent };
        if (mediaIds.length > 0) {
            tweetPayload.media = { media_ids: mediaIds };
        }
        const tweetResponse = await twitterClient.v2.tweet(tweetPayload);
        res.status(StatusCodes.OK).json(
            apiResponse(true, {
                message: "Tweet posted successfully!",
                tweet: tweetResponse,
            })
        );
    } catch (error) {
        console.error("Tweet error:", error);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to post tweet");
    }
});