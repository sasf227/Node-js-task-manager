import { pool } from "../config/db.ts";
import type { Chats } from "../models/chat.model.ts";

export const chat_withInsert = async (email: string, chat_with: string, status: string, room_uuid: string): Promise<Chats> => {
    const result = await pool.query(`INSERT INTO chatwith (email, chat_with, status, room_uuid) VALUES ($1, $2, $3, $4) RETURNING *`, [email, chat_with, status, room_uuid]);
    return result.rows[0];
}

export const getChat_withByEmail = async (email: string): Promise<Array<Chats>> => {
    const result = await pool.query(`SELECT * FROM chatwith WHERE email = $1`, [email]);
    return result.rows;
}

export const get_withByRoomId = async (room_uuid: string): Promise<Chats> => {
    const result = await pool.query(`SELECT * FROM chatwith WHERE room_uuid = $1`, [room_uuid]);
    return result.rows[0];
}
