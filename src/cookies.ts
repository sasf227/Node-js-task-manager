import jwtAuthorization from "./jwt.ts";
import dbOperations from "./db_operations.ts";
import { NONAME } from "node:dns";

export default class cookiesAuth {
    req: any;
    res: any;
    cookiesToCheck: Array<string>;

    constructor (req: any, res: any, cookiesToCheck: Array<string>) {
        this.req = req,
        this.res = res,
        this.cookiesToCheck = cookiesToCheck
    };

    async cookiesObj (): Promise<Record<any, any>> {
        const cookiesIf: Array<string> = [];
        const cookies: Record<any, any> = {};

        for(const cookie of this.cookiesToCheck) {
            cookies[cookie] = this.req.cookies[cookie];
        };

        return cookies 

        // if (this.req.cookies['JWT'] && this.req.cookies['WsessionID']) {
        //         // variables
        //         const weeklySession = this.req.cookies.WsessionID;
        
        //         // classes
        //         const jwt = new jwtAuthorization(this.req, this.res, 'gfg_jwt_secret_key', 'gfg_token_header_key');
        //         const db = new dbOperations;
        
        //         const verifyJWT = await jwt.verifyJWT()
        //         const data = await jwt.decodeJWT();
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

    async cookiesAuth(tokens: Record<any, any>): Promise<boolean> {
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
            return true
        }
    }
}