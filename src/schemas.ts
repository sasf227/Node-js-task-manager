export type authetnicate_user_signup_request = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}
export type keys<T> = Array<keyof T>

export type err = {
    num_error: string;
    empty_error: string;
    pwd_error: string;
}

