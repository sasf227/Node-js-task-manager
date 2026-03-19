type SessionUser = { 
    uuid: string;
    username: string
    email: string
};

declare module "express-session" {
    interface SessionData {
        user?: SessionUser;
    }
}