import express, { RequestHandler } from "express";
import { LLMprocessingForX } from "../controllers/LLMProcessing/LLMprocessing";
const router = express.Router();

router.post("/platforms", LLMprocessingForX as unknown as RequestHandler)

export default router;
