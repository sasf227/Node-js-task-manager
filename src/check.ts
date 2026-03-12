import express from 'express';
import { error } from 'node:console';

export default class login_Check {
    req: any;
    res: any;
    body: any;
    constructor (req: any, res: any, body: any){
        this.req = req;
        this.res = res;
        this.body = body
    }

    isNum<T>(value: T): boolean {
        const isNum: boolean = !(isNaN(Number(value)));
        return isNum;
    };

    isNumCheck(num_keys: Array<string>): void {
        for(const key of num_keys) {
            if (this.isNum(this.body[key])) {
                this.res.send({error: `The ${key} field can't be a number!`});
                return;
            };
        };
        return;
    };

    nameCheck(num_keys: Array<string>): void {
        const usernameRegex = /^(?=.{1,32}$)[a-zA-Z0-9_.-]+( [a-zA-Z0-9_.-]+)*$/;
        const isValidName: boolean = usernameRegex.test(this.body[0]);

        if (!isValidName) {
            this.res.send({error: `Name must be 1–32 characters long and may contain letters, numbers, spaces, underscores (_), dots (.), and dashes (-).`});
            return
        };

        this.isNumCheck(num_keys);
    };

    isMatch(key: string, match_key: string): boolean {
        const isMatch: boolean = this.body[key] === this.body[match_key];
        return isMatch;
    };

    isMatchCheck(key: string, match_key: string): void {
        if (!this.isMatch(key, match_key)) {
            this.res.send({error: `The ${key} field and ${match_key} doesn't matches!`});
            return
        };
    };

    emptyCheck(keys: Array<string>): void {
        if (!this.body) {
            this.res.status(400).send()
            return;
        }
        for (const key of keys) {
            if (!(key in this.body)) {
                this.res.status(400).send()
                return;
            } else if (!(this.body[key])) {
                this.res.send({error: `The ${key} field can't be empty!`});
                return;
            };
        };
    };
}