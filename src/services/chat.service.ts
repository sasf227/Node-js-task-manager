import { pool } from "../config/db.ts";
import type { Chats } from "../models/chat.model.ts";

export const chatInsert = async (email: string, chat_with: string, status: string, room_uuid: string): Promise<Chats> => {
    const result = await pool.query(`INSERT INTO chat (email, chat_with, status, room_uuid) VALUES ($1, $2, $3, $4) RETURNING *`, [email, chat_with, status, room_uuid]);
    return result.rows[0];
}

export const getChatByEmail = async (email: string): Promise<Array<Chats>> => {
    const result = await pool.query(`SELECT * FROM chat WHERE email = $1`, [email]);
    return result.rows;
}

export const getByRoomId = async (room_uuid: string): Promise<Chats> => {
    const result = await pool.query(`SELECT * FROM chat WHERE room_uuid = $1`, [room_uuid]);
    return result.rows[0];
}
