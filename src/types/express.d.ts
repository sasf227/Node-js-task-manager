import { Request } from "express";
import { Tasks } from '../db/models/tasks.model';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
        tasks?: any;
        dayType?: Array<Record<any, any>>;
        token?: any;
        chats?: any;
        chatImg?: Array<Array<Array<string>>>;
        tickets?: any
    };
}

