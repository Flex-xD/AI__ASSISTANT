import express, { RequestHandler } from "express";
import {  tweetUploading } from "../controllers/uploading/uploadingController";
const router = express.Router();

router.post("/twitter", tweetUploading as unknown as RequestHandler);

export default router;