import { pool } from "../config/db.ts";
import type { Contact } from "../models/contact.model.ts";

export const contactInsert = async (contactID: string, userID: string, contactuserID: string, status: string): Promise<Contact> => {
    const result = await pool.query(`INSERT INTO contact (contactid, userid, contactuserid, status) VALUES ($1, $2, $3, $4) RETURNING *`, [contactID, userID, contactuserID, status]);
    return result.rows[0];
}

export const getByUserID = async (userID: string): Promise<Array<Contact>> => {
    const result = await pool.query(`SELECT * FROM contact WHERE userid = $1`, [userID]);
    return result.rows;
}

export const getContactByUserID = async (userID: string): Promise<Array<Contact>> => {
    const result = await pool.query(`SELECT * FROM contact WHERE contactuserid = $1`, [userID]);
    return result.rows;
}

export const getByContactID = async (contactID: string): Promise<Contact> => {
    const result = await pool.query(`SELECT * FROM contact WHERE contactid = $1`, [contactID]);
    return result.rows[0];
}
