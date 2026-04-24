import {pool} from '../config/db.ts';
import type { User } from '../models/user.model.ts';

export const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users ORDER BY id ASC`);
    return result.rows;
};

export const getUserByEmail = async(email: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};

export const createUser = async (username: string, email: string, password: string, uuid: string): Promise<User> => {
    const result = await pool.query(`INSERT INTO users (username, email, password, uuid) VALUES ($1, $2, $3, $4) RETURNING *`, [username, email, password, uuid]);
    return result.rows[0];
};

export const insertImage = async(img: any) => {
    const result = await pool.query(`INSERT INTO users (profpict) VALUES ($1) RETURNING *`, [img]);
    return result.rows[0]
}



    // NOT READY !!!!!!
    // async updateValue<T> (table: string, keysToChange: Array<string> | Array<keys<T>>, newValues: Array<T> | Array<any>, findByKey: string | keys<T>, findValue: string) {
    //     const valNum: Array<string> = [];
    //     for (let i = 1; i < newValues.length; i++) {
    //         valNum.push(`$${i}`);
    //     };
    //     const keysVal: Array<string>  = [];
    //     for(let i = 0; i < keysToChange.length; i++) {
    //         keysVal.push(`${keysToChange[i]} = ${valNum[i]}`)
    //     };
    //     const keysValStr = valNum.toString();
    //     const result = await pool.query(`UPDATE ${table} SET ${keysValStr} WHERE ${findByKey} = $${newValues.length}`, newValues);
    //     return result;
    // };
    
    // // NOT READY !!!!!!
    // async deleteValue<T> (table: string, key: string | keys<T>, value: string) {
    //     const result = await pool.query(`DELETE FROM ${table} WHERE ${key} = $1`, [value]);
    //     return result;
    // };