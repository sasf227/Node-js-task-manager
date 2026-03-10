import bcrypt from 'bcrypt';

export default class passHash {
    async hashPassword(password: string): Promise<string> {
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
        return hashedPassword;
    };

    async checkPassword(password: string, hashedPassword: Promise<string>): Promise<boolean> {
        const match = await bcrypt.compare(password, await hashedPassword);
        console.log(match ? 'Passwords match' : 'Passwords do not match');
        return match;
    };
};


