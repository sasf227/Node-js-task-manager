import {pool} from '../config/db.ts';
import type { Tasks } from '../models/tasks.model.ts';


export const insertIntoTask = async (creator: string, users: Array<string> | undefined, title: string, description: string | undefined, createdat: string, dueto: string, milestones : Array<string> | undefined, creatoremail: string, priority: string, status: string): Promise<Tasks> => {
    const result = await pool.query(`INSERT INTO tasks (creator, users, title, description, createdat, dueto, milestones, creatoremail, priority, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [creator, users, title, description, createdat, dueto, milestones, creatoremail, priority, status]);
    return result.rows[0];
}

export const findTaskbyEmail = async (creatoremail: string): Promise<Array<Tasks>>=> {
    const result = await pool.query(`SELECT * FROM tasks WHERE creatoremail = $1`, [creatoremail]);
    return result.rows;
    
}