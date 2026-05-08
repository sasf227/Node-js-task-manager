import type { Request, Response } from "express"
import type { ChatBody } from "../types/chatBody.js"
import { createChat } from "../services/chating.service.ts";



export const chat = async (req: Request<{}, {}, ChatBody>, res: Response) => {
    try {
        const token = req.cookies['JWT'];
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