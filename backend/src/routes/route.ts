import express, { RequestHandler } from "express";
import { LLMprocessingForTwitter } from "../controller/LLMprocessingController";
const router = express.Router();

router.post("/processing" , LLMprocessingForTwitter as RequestHandler)

export default router;
