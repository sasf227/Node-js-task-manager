import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error } from 'node:console';

export default class jwtAuthorization {
    req: any;
    res: any;
    jwtSecretKey: string;
    tokenHeaderKey: string;
    constructor(req: any, res: any, jwtSecretKey: string, tokenHeaderKey: string) {
        this.req = req;
        this.res = res;
        this.jwtSecretKey = jwtSecretKey;
        this.tokenHeaderKey = tokenHeaderKey;
    }
    async signJWT<T extends object> (data: T | Record<string, any>, exp: number = 1) {
        const token = jwt.sign(data, this.jwtSecretKey, {expiresIn: `${exp}h`})
        this.res.cookie("JWT", token, { maxAge: exp * 60 * 60 * 1000});
    };

    async verifyJWT(): Promise<boolean> {
        const token = this.req.cookies['JWT'];
        if (!token) {
            return this.res.status(401).send('Unauthorized');
        } else {
            try {
                const verifed = jwt.verify(token, this.jwtSecretKey);
                if (verifed) {
                    return true
                } else {
                    return this.res.status(401).send('Unauthorized');
                };
                } catch (error) {
                    return this.res.status(401).send('Unauthorized');
            };
        };
    };

    async decodeJWT (): Promise<string | jwt.JwtPayload | null> {
        const token = this.req.cookies['JWT'];
        if (!token) {
            return this.res.status(401).send('Unauthorized');
        } else {
            try {
                const decoded_result = jwt.decode(token)
                return decoded_result;
            } catch (error) {
                return this.res.status(401).send('Unauthorized');
            };
        };
    };
};
