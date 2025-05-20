import express, { RequestHandler } from "express";
import {  tweetUploading } from "../controllers/uploading/uploadingController";
import { upload } from "../middlewares/multerConfig";
const router = express.Router();

router.post("/twitter", upload.array("images", 4) , tweetUploading as unknown as RequestHandler);

export default router;