import express, { RequestHandler } from "express";
import { LLMprocessingForX } from "../controllers/uploading/LLMprocessing";
const router = express.Router();

router.post("/twitter", LLMprocessingForX as unknown as RequestHandler)

export default router;
