import { pool } from "../config/db.ts";
import type { Chat } from "../models/chat.model.ts";

export const chatInsert = async (emailfrom: string, emailto: string, status: string, usernamefrom: string, usernameto: string, room_uuid: string): Promise<Chat> => {
    const result = await pool.query(`INSERT INTO chat (emailfrom, emailto, status, usernamefrom, usernameto, room_uuid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [emailfrom, emailto, status, usernamefrom, usernameto, room_uuid]);
    return result.rows[0];
}

export const chatGetByEmailFrom = async (email: string): Promise<Array<Chat>> => {
    const result = await pool.query(`SELECT * FROM chat WHERE emailfrom = $1`, [email]);
    return result.rows;
}
export const chatGetByEmailTo = async (email: string): Promise<Array<Chat>> => {
    const result = await pool.query(`SELECT * FROM chat WHERE emailto = $1`, [email]);
    return result.rows;
}