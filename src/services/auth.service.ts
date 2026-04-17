import { createUser, getUserByEmail } from "./user.service.ts";
import { comparePassword, hashPassword } from '../utils/hash.ts';
import { generateToken } from '../utils/jwt.ts';
import { v4 } from "uuid";

export const login = async (body: LoginBody): Promise<{token: string}> => {
    if (!body.email || !body.password) {
        throw new Error("Missing email or password");
    }

    const user = await getUserByEmail(body.email);

    if(!user) {
        throw new Error("User not found");
    }

    const valid = await comparePassword(body.password, user.password);

    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken({
        uuid: user.uuid,
        email: user.email,
        username: user.username
    });

    return { token }
};

export const signup = async (body: SignupBody): Promise<{token: string}> => {
    if (!body.username || !body.email || !body.password || !body.confirmPassword) {
        throw new Error("Complete missing fields");
    } else if (body.password !== body.confirmPassword) {
        throw new Error("Passwords must match")
    }

    const user = await getUserByEmail(body.email);

    if (user) {
        throw new Error("Account already exists");
    }

    const hash = await hashPassword(body.password);

    const create = await createUser(body.username, body.email, hash, v4());
    if (!create) {
        throw new Error("User can't be created, try again later");
    };
    
    
    const token = generateToken({
        uuid: create.uuid,
        email: create.email,
        username: create.username
    });

    return { token }
    
}