import { verifyToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export const homeAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.JWT;

    if (!token) return res.redirect('/login');

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch {
        return res.redirect('/login');
    };
};

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