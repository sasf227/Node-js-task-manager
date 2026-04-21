import { Pool } from 'pg';
export const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'taskmanager', //'node',
    password: 'sasf227', //'root',
    port: 5432,
})