import { libredesk } from "../config/db.ts";

export const getTicketByEmail = async (email: string) => {
    const result = await libredesk.query(`SELECT * FROM conversations WHERE subject = $1`, ['bill1980@gmail.com']);
    return result.rows
}