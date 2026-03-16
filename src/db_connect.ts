import { Pool } from 'pg';
export const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'node',
    password: 'root',
    port: 5432,
})