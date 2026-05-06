import { pool } from "../config/db.ts";
import type { Chat } from "../models/chat.model.ts";

export const chatInsert = async (emailfrom: string, emailto: string, status: string): Promise<Chat> => {
    const result = await pool.query(`INSERT INTO chat (emailfrom, emailto, status) VALUES ($1, $2, $3) RETURNING *`, [emailfrom, emailto, status]);
    return result.rows[0];
}