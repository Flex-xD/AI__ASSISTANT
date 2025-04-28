import express, { RequestHandler } from "express";
import { LLMprocessingForX } from "../controller/LLMprocessingController";
const router = express.Router();

router.post("/processing" , LLMprocessingForX as unknown as RequestHandler)

export default router;
