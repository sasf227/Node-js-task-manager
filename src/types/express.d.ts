import { Request } from "express";
import { Tasks } from '../models/tasks.model';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
        tasks?: any;
        dayType?: Array<Record<any, any>>;
    };
}

