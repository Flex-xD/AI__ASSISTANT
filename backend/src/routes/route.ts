import express, { RequestHandler } from "express";
import { LLMprocessingForX, tweetUploading } from "../controllers/uploading";
const router = express.Router();

router.post("/uploading/twitter", tweetUploading as unknown as RequestHandler)
router.post("/processing", LLMprocessingForX as unknown as RequestHandler)

export default router;
