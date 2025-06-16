import { cloudinary } from "./cloundinary";

export const uploadToCloudinary = async (filePath: string) => {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload(filePath, {
            folder: "reddit-posts",
            resource_type: "image",
        }, (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
        });
    });
};