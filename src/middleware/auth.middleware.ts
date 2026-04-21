import type { JwtPayload } from "jsonwebtoken";
import type { UserToken } from "../models/user.model.ts";
import { findTaskbyEmail } from "../services/task.service.ts";
import { verifyToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export const homeAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.JWT;
    if (!token) return res.redirect('/login');
    
    try {
        const user = verifyToken(token);
        req.user = user;

        if (typeof user === 'string' || !user || typeof (user as any).email !== 'string') {
            return res.redirect('/login');
        }
        const tasks = await findTaskbyEmail(user.email);
        req.tasks = tasks

        next();
    } catch {
        return res.redirect('/login');
    };


};

export const createMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.JWT;

    if (!token) return res.redirect('/login');

    try {
        const user = verifyToken(token);
        req.user = user;
        next()
    } catch {
        return res.redirect('/login');
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.JWT;

    if (!token) return next();

    try {
        const user = verifyToken(token);
        req.user = user;
        res.redirect('/home');
    } catch {
        return next()
    }
}