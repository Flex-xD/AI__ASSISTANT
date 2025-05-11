import express, { RequestHandler } from "express";
import { LLMprocessingForX } from "../controllers/processing/LLMprocessingController";
import { TweetUploading } from "../controllers/uploading";
const router = express.Router();

router.post("/processing" , LLMprocessingForX as unknown as RequestHandler)
router.post("/uploading/twitter", TweetUploading as unknown as RequestHandler)

export default router;
