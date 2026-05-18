import { verify } from "node:crypto";
import type { ChatBody } from "../types/chatBody.js"
import { verifyToken } from "../utils/jwt.ts";
import { chatInsert } from "./chat.service.ts";
import type { UserToken } from "../models/user.model.ts";
import type { JwtPayload } from "jsonwebtoken";
import { getUserByEmail } from "./user.service.ts";
import type { Chats } from "../models/chat.model.ts";
import { getRoom } from "../utils/getRoom.ts";
import { hashPassword } from "../utils/hash.ts";
import { chat_withInsert } from "./chat_with.service.ts";

export const createChat = async(body: ChatBody, jwt: string): Promise<[Chats, string, string, string]> => {
    if (!body.emailto) {
        throw new Error("Unknown error, try again later or contact a customer service")
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

    const room_uuid = getRoom(user.email, userto.email)
    
    const createChat = await chatInsert(user.email, userto.email, "Created", room_uuid);
    return [createChat, userto.username, userto.imgpath, room_uuid];
}

export const connectChat = async (body: ChatBody, jwt: string): Promise<[Chats, string, string, string]> => {
    if (!body.emailto) {
        throw new Error("Unknown error, try again later or contact a customer service")
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

    const room_uuid = getRoom(user.email, userto.email)
    
    const createChat = await chat_withInsert(user.email, userto.email, "Created", room_uuid);
    return [createChat, userto.username, userto.imgpath, room_uuid];
}