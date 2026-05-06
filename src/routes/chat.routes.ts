import { Router } from "express";
import { chat } from "../controllers/chat.controller.ts";

const router = Router();

router.post('/chat', chat)

export default router