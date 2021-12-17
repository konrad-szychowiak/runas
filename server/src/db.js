import postgres from "postgres";

export const sql = postgres({
    username: 'root',
    password: 'root',
    database: 'test'
})