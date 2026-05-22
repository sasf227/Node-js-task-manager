import { Pool } from 'pg';
export const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'node',
    password: 'root',
    port: 5432,
})

export const libredesk = new Pool({
    user: 'libredesk',
    host: '10.0.0.252',
    database: 'libredesk',
    password: 'libredesk',
    port: 5432,
})