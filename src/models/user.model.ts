export type User = { 
    username: string;
    email: string;
    password: string; 
    uuid: string
}

export type UserToken = {
    uuid: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}