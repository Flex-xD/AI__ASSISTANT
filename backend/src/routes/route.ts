import express, { RequestHandler } from "express";
import { LLMprocessingForThreads, LLMprocessingForX } from "../controllers/LLMprocessingController";
const router = express.Router();

router.post("/process" , LLMprocessingForThreads as unknown as RequestHandler)

export default router;
