import { Router } from "express";
import { login, signup } from '../controllers/auth.controller.ts';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);

export default router