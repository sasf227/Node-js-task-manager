import type { JwtPayload } from "jsonwebtoken";
import type { User, UserToken } from "../models/user.model.ts";
import { findTaskbyEmail, updateTaskStatus } from "../services/task.service.ts";
import { verifyToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";
import { isToday, formatDistanceToNow} from "date-fns";
import { hashPassword } from "../utils/hash.ts";
import { getChatByEmail } from "../services/chat.service.ts";
import { getUserByEmail } from "../services/user.service.ts";

export const homeAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.JWT;
    if (!token) return res.redirect('/login');
    
    try {
        const user: UserToken | JwtPayload | string  = verifyToken(token);
        if (typeof user === "string") {
            return res.redirect('/login')
        }
        const verifyUser = getUserByEmail(user.email)
        if (!verifyUser){
            return res.redirect('/signIn')
        }
        req.user = user;
        // Cryptere const hashToken = await hashPassword(token)
        req.token = token;
        if (typeof user === 'string' || !user || typeof (user as any).email !== 'string') {
            return res.redirect('/login');
        }
        const tasks = await findTaskbyEmail(user.email);
        const days:Array<Record<any, any>> = []
        tasks.forEach(task => {
            const dayType = formatDistanceToNow(task.dueto, { addSuffix: true});
            const dayHour = ((Date.parse(task.dueto) / 1000 / 60 / 60 / 24) - (Date.now() / 1000 / 60 / 60 / 24));
            const daysleft = dayHour.toFixed()
            if (dayHour < 0 && task.status === "In Progress") {
                const updateTask = updateTaskStatus("Incompleted", task.id)
            }
            days.push({id: task.id, dayType, daysleft});
        });
        
        req.tasks = tasks
        req.dayType = days


        
        next();
    } catch {
        return res.redirect('/login');
    };


};


export const chatAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.JWT;
    if (!token) return res.redirect('/login');
    
    try {
        const user: UserToken | JwtPayload | string  = verifyToken(token);
        if (typeof user === "string") {
            return res.redirect('/login')
        }
        const verifyUser = await getUserByEmail(user.email)
        if (!verifyUser){
            return res.redirect('/signIn')
        }
        req.user = user;
        req.token = token;
        
        const chats = await getChatByEmail(verifyUser.email)
        req.chats = chats
        
        next();
    } catch {
        return res.redirect('/login');
    }
}

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