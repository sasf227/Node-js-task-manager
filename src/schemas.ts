export type authenticate_user_signup_request = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
};
export type authenticate_user_login_reques = {
    email: string;
    password: string;
};

export type user_db_schema = {
    username: string;
    email: string;
    password: string;
    uuid: string;
}

export type keys<T> = Array<keyof T>;


