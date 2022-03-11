import postgres from "postgres";
import Pool from "pg-pool"

/**
 * Connection pool to the postgres db
 * @type {Pool}
 */
export const pool = new Pool({
    user: 'root',
    password: 'root',
    database: 'test',
    // host: 'runasdb',
    host: 'localhost',
    // max: 25,
});

/**
 * @deprecated
 * @type {(function(*): any|Promise<unknown>)|*}
 */
export const sql = postgres({
    username: 'root',
    password: 'root',
    database: 'test',
    // host: 'runasdb',
    host: 'localhost',
    max: 10,
})