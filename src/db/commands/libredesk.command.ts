import { libredesk } from "../config/db.ts";
import type { Attributes } from '../models/libredesk.attr.model.ts';

export const getTicketByEmail = async (email: string) => {
    const result = await libredesk.query(`SELECT * FROM conversations WHERE custom_attributes->>'email' = $1`, [email]);
    return result.rows
}

export const getConversationId = async (source_id: string) => {
    console.log(source_id)
    const result = await libredesk.query(`SELECT * FROM conversation_messages WHERE source_id = $1`, [source_id]);
    return result.rows[0]
}

export const getConversationFromId = async (id: number) => {
    const result = await libredesk.query(`SELECT * FROM conversations WHERE id = $1`, [id]);
    return result.rows[0]
}

export const updateMetaTicket = async (meta: Record<string, string>, id: number) => {
    const result = await libredesk.query(`UPDATE conversations SET meta = $1 WHERE id = $2`, [meta, id]);
    return result.rows[0]
}

export const updateTicketAttr = async (Attributes: Attributes, id: number) => {
    const result = await libredesk.query(`UPDATE conversations SET custom_attributes = $1 WHERE id = $2`, [Attributes, id]);
    return result.rows[0]
}