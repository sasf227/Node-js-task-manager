import { Router } from "express";
import { create } from "../controllers/taskCreate.controller.ts";

const router = Router()

router.post('/newTask', create);

export default router