export default class login_Check {
    req: any;
    res: any;
    body: any;
    constructor (req: any, res: any, body: any){
        this.req = req;
        this.res = res;
        this.body = body
    }

    //section 1
    isNum<T>(value: T): boolean {
        const isNum: boolean = !(isNaN(Number(value)));
        return isNum;
    };

    isNumCheck(num_keys: Array<string>): void {
        for(const key of num_keys) {
            if (this.isNum(this.body[key])) {
                return this.res.send({error: `The ${key} field can't be a number!`});
            };
        };
        return;
    };

    isMatch(key: string, match_key: string): boolean {
        const isMatch: boolean = this.body[key] === this.body[match_key];
        return isMatch;
    };

    isMatchCheck(key: string, match_key: string): void {
        if (!this.isMatch(key, match_key)) {
            return this.res.send({error: `The ${key} field and ${match_key} doesn't matches!`});
        };
    };

    // section 2
    emptyCheck(keys: Array<string>): void {
        if (!this.body) {
            return this.res.status(400).send()
        }
        for (const key of keys) {
            if (!(key in this.body)) {
                return this.res.status(400).send();
            } else if (!(this.body[key])) {
                return this.res.send({error: `The ${key} field can't be empty!`});
            };
        };
    };

    nameCheck(name_key: string): void {
        const usernameRegex: RegExp = /^(?=.{1,32}$)[a-zA-Z0-9_.-]+( [a-zA-Z0-9_.-]+)*$/;
        const isValidName: boolean = usernameRegex.test(this.body[name_key]);

        if (!isValidName) {
            return this.res.send({error: `Name must be 1–32 characters long and may contain letters, numbers, spaces, underscores (_), dots (.), and dashes (-).`});
        };
    };

    emailCheck(email_key: string): void {
        const emailRegex:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,254}$/;
        const isValidEmail: boolean = emailRegex.test(this.body[email_key]);

        if (!isValidEmail) {
            return this.res.send({error: `Please enter a valid email address.`});
        };
    };

    pwdCheck(pwd_key: string): void {
        const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;
        const isValidPwd: boolean = passwordRegex.test(this.body[pwd_key]);

        if (!isValidPwd) {
            return this.res.send({error: `Password must be 8–64 characters and include an uppercase letter, a lowercase letter, a number, and a special character.`});
        };
    };

    //section 3
    signup(keys: Array<string>, num_keys: Array<string>, name_key: string, email_key: string, pwd_key: string, pwd_match_key: string): void {
        this.emptyCheck(keys);
        this.isNumCheck(num_keys);
        this.nameCheck(name_key);
        this.emailCheck(email_key);
        this.pwdCheck(pwd_key);
        this.isMatchCheck(pwd_key, pwd_match_key);
        return;
    };

    login(keys: Array<string>, num_keys: Array<string>, email_key: string, pwd_key: string) {
        this.emptyCheck(keys);
        this.isNumCheck(num_keys);
        this.emailCheck(email_key);
        this.pwdCheck(pwd_key);
        return;
    }
}