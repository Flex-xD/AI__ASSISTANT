import { StatusCodes } from "http-status-codes";
import { TwitterApi } from "twitter-api-v2";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import fs from "fs";
import { ApiError, apiResponse, asyncHandler } from "../../middleware/helperFunctions";
import mime from "mime";
import Snoowrap from "snoowrap";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

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

const redditClient = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT as string,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
});

interface RedditPostResponse {
    id: string;
    title: string;
    permalink: string;
}

export const redditUploading = asyncHandler(async (req: Request, res: Response) => {
    const { title, content, subreddit } = req.body;
    if (!title || !subreddit) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Title and subreddit are required.');
    }

    const file = req.file;
    let id: string, returnedTitle: string, permalink: string;

    try {
        // Test authentication
        // console.log('Testing Reddit client authentication...');
        // const user = await redditClient.getMe();
        // console.log('Authenticated as:', user.name);

        if (file) {
            const mimeType = mime.getType(file.originalname);
            if (!mimeType || !['image/jpeg', 'image/png'].includes(mimeType)) {
                fs.unlinkSync(file.path);
                throw new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, 'Unsupported image type.');
            }

            const uploadRes = await uploadToCloudinary(file.path);
            fs.unlinkSync(file.path);

            console.log('Submitting link post to subreddit:', subreddit);
            const rawResp = await (redditClient
                .getSubreddit(subreddit)
                .submitLink({
                    subredditName: subreddit,
                    title,
                    url: uploadRes.secure_url,
                }) as Promise<RedditPostResponse>);

            ({ id, title: returnedTitle, permalink } = rawResp);
        } else {
            if (!content) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Content is required for text posts.');
            }

            console.log('Submitting self-post to subreddit:', subreddit);
            const rawResp = await (redditClient
                .getSubreddit(subreddit)
                .submitSelfpost({
                    subredditName: subreddit,
                    title,
                    text: content,
                }) as Promise<RedditPostResponse>);

            ({ id, title: returnedTitle, permalink } = rawResp);
        }

        res.status(StatusCodes.OK).json(
            apiResponse(true, {
                message: 'Post submitted to Reddit successfully.',
                post: { id, title: returnedTitle, url: `https://reddit.com${permalink}` },
            })
        );
    } catch (error: any) {
        console.error('Reddit API error:', error.message);
        console.error('Error details:', error);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to post to Reddit: ${error.message}`);
    }
});