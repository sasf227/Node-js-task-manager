import {pool} from '../config/db.ts';
import type { Tasks } from '../models/tasks.model.ts';


export const insertIntoTask = async (creator: string, users: Array<string> | undefined, title: string, description: string | undefined, createdat: string, dueto: string, milestones : Array<string> | undefined, creatoremail: string): Promise<Tasks> => {
    const result = await pool.query(`INSERT INTO tasks (creator, users, title, description, createdat, dueto, milestones, creatoremail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [creator, users, title, description, createdat, dueto, milestones, creatoremail]);
    return result.rows[0];
}