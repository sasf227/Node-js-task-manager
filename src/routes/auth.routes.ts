import { Router } from "express";
import { login, signIn } from '../controllers/auth.controller.ts';

const router = Router();

router.post('/login', login);
router.post('/signIn', signIn);

export default router