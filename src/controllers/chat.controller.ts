import type { Request, Response } from "express"
import type { ChatBody } from "../types/chatBody.js"
import { connectChat, createChat } from "../services/chating.service.ts";
import { verifyToken } from "../utils/jwt.ts";
import type { UserToken } from "../models/user.model.ts";
import type { JwtPayload } from "jsonwebtoken";
import { getRoom } from '../utils/getRoom.ts';
import { getByRoomId } from "../services/chat.service.ts";



export const chat = async (req: Request<{}, {}, ChatBody>, res: Response) => {
    try {
        if (!req.body.emailto) {
            throw new Error("Complete missing fields");
        }

        const token = req.cookies['JWT'];
        const verifyUser: UserToken | JwtPayload | string = verifyToken(token)
        if (!verifyUser || typeof verifyUser === 'string') return res.status(401).send({error: "Unauthorized, log in and try again later"});
        if (typeof verifyUser === 'string') return res.status(401).send({error: "Unauthorized, log in and try again later"});
        const RoomCode = getRoom(verifyUser.email, req.body.emailto)
        const isRoomExist = await getByRoomId(RoomCode)
        if (isRoomExist) {
            const result = await connectChat(req.body, token);
            if (result) {
                return res.send({chat: "connected", username: result[1], imgpath: result[2]})
            }
        }
        
        const result = await createChat(req.body, token);
        if (result[0] && typeof result[1] !== 'undefined') {
            res.send({chat: "created", username: result[1], imgpath: result[2]})
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send({error: err.message});
        } else {
            res.status(400).send({error: "Unknown error, try again later"});
        };       
    }
}