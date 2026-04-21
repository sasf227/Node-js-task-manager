import type { Request, Response } from 'express';
import { createTask } from '../services/create.service.ts';

export const create = async (req: Request<{}, {}, TaskBody>, res: Response) => {
    try {
        const token = req.cookies['JWT']
        const result = await createTask(req.body, token)
        if (result) {
            res.send({redirect: "/home"})
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send({error: err.message});
        } else {
            res.status(400).send({error: "Unknown error, try again later"});
        };       
    }
}