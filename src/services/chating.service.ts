import { verify } from "node:crypto";
import type { ChatBody } from "../types/chatBody.js"
import { verifyToken } from "../utils/jwt.ts";
import { chatInsert } from "./chat.service.ts";
import type { UserToken } from "../models/user.model.ts";
import type { JwtPayload } from "jsonwebtoken";
import { getUserByEmail } from "./user.service.ts";
import type { Chat } from "../models/chat.model.ts";

export const createChat = async(body: ChatBody, jwt: string): Promise<[Chat, string]> => {
    if (!body.emailto) {
        throw new Error("Complete missing fields");
    }
    const valid: UserToken | JwtPayload | string = verifyToken(jwt);
    if (!valid || typeof valid === 'string') {
        throw new Error ("Unauthorized user, login or try again later");
    }
    const user = await getUserByEmail(valid.email)
    if (!user) {
            throw new Error ("Unknown error, try again later or contact a customer service");
    };

    const userto = await getUserByEmail(body.emailto)
    if (!user) {
        throw new Error ("There is no user with such email")
    }
    const createChat = await chatInsert(user.email, userto.email, "In chat");
    return [createChat, userto.username];
}