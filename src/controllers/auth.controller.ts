import * as authService from '../services/auth.service.ts';
import type { Request, Response } from 'express';

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const result = await authService.login(req.body);
        
        res.cookie("JWT", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.send({redirect: "/home"});

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send({error: err.message});
        } else {
            res.status(400).send({error: "Unknown error, try again later"});
        };       
    };
};

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
        const result = await authService.signup(req.body);

        res.cookie("JWT", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.send({redirect: "/home"});
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send({error: err.message});
        } else {
            res.status(400).send({error: "Unknown error, try again later"});
        }; 
    }
}