import { libredesk } from "../config/db.ts";
import type { Custom_attr } from "../models/libredesk.attr.model.ts";

export const getTicketById = async (source_id: string) => {
    const result = await libredesk.query("SELECT * FROM conversation_messages WHERE source_id = $1", [source_id]);
    return result.rows[0];
}

export const updateTicketById = async (custom_attr: Custom_attr, id: number) => {
    const result = await libredesk.query("UPDATE conversations SET custom_attributes = $1 WHERE id = $2", [custom_attr, id])
    return result.rows[0]
}

export const getTicketByEmail = async (email: string) => {
    const result = await libredesk.query("SELECT * FROM conversations WHERE custom_attributes->>'email' = $1", [email]);
    return result.rows[0];
}