import {sql} from "../db.js";

export const listSpelling = async () => {
    const rows = await sql`SELECT *
                           FROM spelling;`;
    return rows
}

export const readSpelling = async (word_id) => {
    const [one] = await sql`SELECT *
                            FROM spelling
                            WHERE word_id = ${word_id}`
    return one
}

export const createSpelling = async (spelling) => {
    // todo: constraints
    await sql`INSERT INTO spelling (spelling)
              VALUES (${spelling});`
    const [inserted] = await sql`SELECT word_id id
                                 FROM spelling
                                 WHERE spelling = ${spelling}`;
    const {id} = inserted;
    return id;
}

const deleteOne = async (id) => {
    await sql`delete
              from spelling
              where word_id = ${id}`
    return id
}

export const deleteMany = async (idList) => {
    await idList.map(id =>
        deleteOne(id)
    )
    return idList;
}