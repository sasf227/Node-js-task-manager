import bcrypt from 'bcrypt';

export default class passHash {
    async hashPassword(password: string): Promise<string> {
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

    async checkPassword(password: string, hashedPassword: Promise<string>): Promise<boolean> {
        const match: boolean = await bcrypt.compare(password, await hashedPassword);
        return match;
    };
};


