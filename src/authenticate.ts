import session from 'express-session'
export default class Authenticate {
    req: any;
    res: any;
    next: any;
    constructor(req: any, res: any, next: any) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    async isAuthenticated() {
        if (this.req.session.user) {
            return true
        } else {
            this.res.send({url: '/login'}) 
        }
    }
}