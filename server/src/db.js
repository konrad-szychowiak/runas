import postgres from "postgres";
import Pool from "pg-pool"

export const pool = new Pool({
    user: 'root',
    password: 'root',
    database: 'test',
    // host: 'runasdb',
    host: 'localhost',
    // max: 25,
});

export const sql = postgres({
    username: 'root',
    password: 'root',
    database: 'test',
    // host: 'runasdb',
    host: 'localhost',
    max: 10,
})