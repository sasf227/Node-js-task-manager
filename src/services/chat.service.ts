import { pool } from "../config/db.ts";
import type { Chat } from "../models/chat.model.ts";

export const chatInsert = async (emails: [[string], [string]], usernames: [[string], [string]], statusOfChat: string, room_uuid: string): Promise<Chat> => {
    const result = await pool.query(`INSERT INTO chat (emails, usernames, status, room_uuid) VALUES ($1, $2, $3, $4) RETURNING *`, [emails, usernames, statusOfChat, room_uuid]);
    return result.rows[0];
}

export const getChatByEmail = async (email: string): Promise<Array<Chat>> => {
const result = await pool.query(`SELECT * FROM chat WHERE emails[1][1] = $1`, [email]);
    return result.rows;
}
