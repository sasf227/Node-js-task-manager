import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const SECRET = process.env.JWT_SECRET_KEY!;

export const generateToken = (payload: Record<any, any>) => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET);
};