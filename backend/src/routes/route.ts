import express, { RequestHandler } from "express";
import { LLMprocessingForX } from "../controllers/LLMprocessingController";
const router = express.Router();

router.post("/processing" , LLMprocessingForX as unknown as RequestHandler)

export default router;
