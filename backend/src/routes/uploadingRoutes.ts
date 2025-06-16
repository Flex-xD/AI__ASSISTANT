import express, { RequestHandler } from "express";
import { redditUploading, tweetUploading } from "../controllers/uploading/uploadingController";
import { upload } from "../middleware/multerConfig";
const router = express.Router();

router.post("/twitter" , upload.array("files", 4) , tweetUploading as unknown as RequestHandler);
router.post("/reddit", upload.array("media", 1), redditUploading);

export default router;