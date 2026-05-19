import type { JwtPayload } from "jsonwebtoken";
import type { User, UserToken } from "../db/models/user.model.ts";
import { findTaskbyEmail, updateTaskStatus } from "../db/commands/task.commands.ts";
import { verifyToken } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";
import { isToday, formatDistanceToNow} from "date-fns";
import { hashPassword } from "../utils/hash.ts";
// import { getChatByEmail } from "../db/commands/contact.commands.ts";
// import { getUserByEmail } from "../db/commands/user.commands.ts";
// import type { Chats } from "../db/models/contact.model.ts";
import { getChat_withByEmail } from "../db/commands/chat_with.commands.ts";


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
        const verifyUser: UserToken | JwtPayload | string  = verifyToken(token);
        if (typeof verifyUser === "string") {
            return res.redirect('/login')
        }
        const user = await getUserByEmail(verifyUser.email)
        if (!user){
            return res.redirect('/signIn')
        }
        req.user = user;
        req.token = token;
        
        const chatRooms: Array<Record<string, string | number>> = []
        
     
        const chat = await getChatByEmail(user.email);
        const chat_with = await getChat_withByEmail(user.email);
            
        if (chat || chat_with) {
            for (const chats of chat) {
                const user = await getUserByEmail(chats.chat_with)
                chatRooms.push({id: chats.id, email: chats.email, chat_with: chats.chat_with, status: chats.status, room_uuid: chats.room_uuid, username: user.username, imgpath: user.imgpath})
            }
            for (const chats of chat_with) {
                const user = await getUserByEmail(chats.chat_with)
                chatRooms.push({id: chats.id, email: chats.email, chat_with: chats.chat_with, status: chats.status, room_uuid: chats.room_uuid, username: user.username, imgpath: user.imgpath})
            }
        }
        req.chats = chatRooms
        
       
        
        
        
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