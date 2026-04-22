import type { JwtPayload } from "jsonwebtoken";
import type { UserToken } from "../models/user.model.ts";
import { findTaskbyEmail } from "../services/task.service.ts";
import { verifyToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";
import { subDays, formatDistanceToNow} from "date-fns";

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
        const days:Array<Array<any>> = []
        tasks.forEach(task => {
            const dayType = formatDistanceToNow(task.dueto, { addSuffix: true});
            days.push([task.id, dayType]);
        });
        
        req.tasks = tasks
        req.dayType = days
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