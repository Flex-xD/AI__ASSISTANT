import multer from "multer";
import path from "path";
import { Request } from "express";

const fileFilter = (req:Request, file:Express.Multer.File, cb:any) => {
    const allowedTypes = /\.(jpe?g|png)$/i; 
    const allowedMimes = /image\/(jpe?g|png)/i;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (allowedTypes.test(ext) && allowedMimes.test(mime)) {
        cb(null, true);
        } else {
            cb(new Error("Only .jpeg, .jpg, and .png images are allowed"));
        }
    };
    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/"); 
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    });
    
    export const upload = multer({
        storage,
        fileFilter,
        limits: { files: 4, fileSize: 5 * 1024 * 1024 },
    });
