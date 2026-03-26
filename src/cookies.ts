import jwtAuthorization from "./jwt.ts";
import dbOperations from "./db_operations.ts";
import jwt from 'jsonwebtoken';

// Needs more work
export default class cookiesAuth {
    req: any;
    res: any;
    cookiesToCheck: Array<string>;
    JWT_SecretKey?: string | undefined;
    JWT_Header?: string | undefined;

    constructor (req: any, res: any, cookiesToCheck: Array<string>, JWT_SecretKey?: string | undefined, JWT_Header?: string | undefined) {
        this.req = req,
        this.res = res,
        this.cookiesToCheck = cookiesToCheck,
        this.JWT_SecretKey = JWT_SecretKey,
        this.JWT_Header = JWT_Header
    };

    async cookiesObj (): Promise<Record<any, any>> {
        const cookies: Record<any, any> = {};

        for(const cookie of this.cookiesToCheck) {
            cookies[cookie] = this.req.cookies[cookie];
        };

        return cookies 

        // if (this.req.cookies['JWT'] && this.req.cookies['WsessionID']) {
        //         // variables
        //         const weeklySession = this.req.cookies.WsessionID;
        
        //         // classes
        //         
        
        //        
        //     //     if (verifyJWT && data && data.WsessionID === weeklySession) {
        //     //         const check_result = await db.getByValue<user_db_schema> ('users', ['email'], data.email);
        //     //         const user = check_result.rows[0];
        //     //         if (user && user.username === data.username && user.email === data.email && user.uuid === data.uuid) {
        //     //             _req.session.user = {
        //     //                 uuid: data.uuid,
        //     //                 username: data.username,
        //     //                 email: data.email,
        //     //             };
        
        //     //             _res.cookie("sessionID", _req.sessionID);
        //     //             _res.redirect('/home')
        //     //         } else {_res.render('signup', {result: null});};
        //     //     } else {_res.render('signup', {result: null});};
        //     // } else {
        //     //     _res.render('signup', {result: null});
        //     // };
        
    };

    async cookiesAuth(tokens: Record<any, any>, cookieCheckKey: Record<any, any>): Promise<boolean | jwt.JwtPayload | null | string> {
        const check: Array<string> = []
        for (const cookie of this.cookiesToCheck) {
            if (!this.req.cookies[cookie]){
                check.push('false');
            } else {
                check.push('true')
            };
        };

        if (check.includes('false')){
            return false
        } else {
            const db = new dbOperations;
            if (this.JWT_SecretKey && this.JWT_Header) {
                const jwt = new jwtAuthorization(this.req, this.res, this.JWT_SecretKey, this.JWT_Header);
                const verifyJWT = await jwt.verifyJWT();
                const JWT = await jwt.decodeJWT();
                const JWTtoString = JSON.stringify(JWT);
                const JWTjson = JSON.parse(JWTtoString);


                //JWTjson[var][var][var]
                
                
                for (const item in JWTjson) {
                    if (typeof JWTjson[item] === "object") {
                        for (const info in JWTjson[item]) {
                            //console.log(`${info}: ${JWTjson[item][info]}`)
                        };
                    } else {
                        //console.log(`${item}: ${JWTjson[item]}`)
                    };
                };
                return JSON.stringify(JWT)
            }
            return true
        }
    }
}