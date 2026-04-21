import { verifyToken } from "../utils/jwt.ts";
import { insertIntoTask } from "./task.service.ts";
import { getUserByEmail } from "./user.service.ts"
import type { Tasks } from '../models/tasks.model.ts';

export const createTask = async (body: TaskBody, jwtToken: string): Promise<Tasks> => {
    if (!body.title || !body.dueto || !body.priority){
        throw new Error("Complete missing fields")
    } else if (!body.creator || !body.createdat || !body.creatoremail || !body.status) {
        throw new Error("Unknown error, try again later or contact a customer service")
    }
    const user = getUserByEmail(body.creatoremail);
    if (!user) {
        throw new Error ("Unknown error, try again later or contact a customer service");
    };
    if (!jwtToken) {
        throw new Error ("Unauthorized user, login or try again later");
    };
        
    const valid = verifyToken(jwtToken);
    if (!valid) {
        throw new Error ("Unauthorized user, login or try again later");
    };

    const create: Tasks = await insertIntoTask(body.creator, body.users, body.title, body.description, body.createdat, body.dueto, body.milestones, body.creatoremail, body.priority, body.status);
    return create;
}