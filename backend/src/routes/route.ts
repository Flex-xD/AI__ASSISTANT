import express from "express";
import { LLMprocessingForTwitter } from "../controller/LLMprocessingController";
const router = express.Router();

router.post("/processing" , LLMprocessingForTwitter)

export default router;