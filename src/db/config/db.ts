import { Pool } from 'pg';
export const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'taskmanager',
    password: 'sasf227',
    port: 5432,
})