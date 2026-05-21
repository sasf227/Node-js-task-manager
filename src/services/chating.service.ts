import { verify } from "node:crypto";
import type { ChatBody } from "../types/chatBody.js"
import { verifyToken } from "../utils/jwt.ts";
import type { UserToken } from "../db/models/user.model.ts";
import type { JwtPayload } from "jsonwebtoken";
import { getUserByEmail } from "../db/commands/user.commands.ts";
import { getRoom } from "../utils/getRoom.ts";
import type { Contact } from "../db/models/contact.model.ts";
import { contactInsert } from "../db/commands/contact.commands.ts";

export const createChat = async(body: ChatBody, jwt: string): Promise<[Contact, string, string]> => {
    if (!body.emailto || !jwt) {
        throw new Error("Unknown error, try again later or contact a customer service")
    }

    const valid: UserToken | JwtPayload | string = verifyToken(jwt);
    if (!valid || typeof valid === 'string') {
        throw new Error ("Unauthorized user, login or try again later");
    }


    const user = await getUserByEmail(valid.email)
    const userTo = await getUserByEmail(body.emailto)
    if (!user) {
            throw new Error ("Unknown error, try again later or contact a customer service");
    } else if (!userTo) {
        throw new Error ("There is no user with such email");
    }
    

    const contactID = getRoom(user.email, userTo.email)
    
    const createChat = await contactInsert(contactID, user.uuid, userTo.uuid, "In chat");
    return [createChat, userTo.username, userTo.imgpath];
}

// export const connectChat = async (body: ChatBody, jwt: string): Promise<[Chats, string, string, string]> => {
//     if (!body.emailto) {
//         throw new Error("Unknown error, try again later or contact a customer service")
//     }
//     const valid: UserToken | JwtPayload | string = verifyToken(jwt);
//     if (!valid || typeof valid === 'string') {
//         throw new Error ("Unauthorized user, login or try again later");
//     }
//     const user = await getUserByEmail(valid.email)
//     if (!user) {
//             throw new Error ("Unknown error, try again later or contact a customer service");
//     };

//     const userto = await getUserByEmail(body.emailto)
//     if (!user) {
//         throw new Error ("There is no user with such email")
//     }

//     const room_uuid = getRoom(user.email, userto.email)
    
//     const createChat = await chat_withInsert(user.email, userto.email, "Created", room_uuid);
//     return [createChat, userto.username, userto.imgpath, room_uuid];
// }