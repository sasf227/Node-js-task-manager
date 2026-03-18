import {pool} from './db_connect.ts';
import type {keys} from './schemas.ts';


export default class dbOperations {
    async getAll (table: string) {
        const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
        return result;
    };

    async getByValue<T> (table: string, key: string | keys<T>, value: string) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${key} = $1`, [value]);
        return result;
    };

    async insertInto<T> (table: string, keys: Array<string> | keys<T>, values: Array<any>) {
        const keyString = keys.toString();
        const valNum: Array<string> = []
        for (let i = 1; i <= values.length; i++) {
            valNum.push(`$${i}`);
        };
        const valNumStr = valNum.toString();
        const result = await pool.query(`INSERT INTO ${table} (${keyString}) VALUES (${valNumStr})`, values);
        return result;
    };

    // NOT READY !!!!!!
    async updateValue<T> (table: string, keysToChange: Array<string> | Array<keys<T>>, newValues: Array<T> | Array<any>, findByKey: string | keys<T>, findValue: string) {
        const valNum: Array<string> = [];
        for (let i = 1; i < newValues.length; i++) {
            valNum.push(`$${i}`);
        };
        const keysVal: Array<string>  = [];
        for(let i = 0; i < keysToChange.length; i++) {
            keysVal.push(`${keysToChange[i]} = ${valNum[i]}`)
        };
        const keysValStr = valNum.toString();
        const result = await pool.query(`UPDATE ${table} SET ${keysValStr} WHERE ${findByKey} = $${newValues.length}`, newValues);
        return result;
    };
    
    // NOT READY !!!!!!
    async deleteValue<T> (table: string, key: string | keys<T>, value: string) {
        const result = await pool.query(`DELETE FROM ${table} WHERE ${key} = $1`, [value]);
        return result;
    };
};