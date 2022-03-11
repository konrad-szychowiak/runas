import {pool, sql} from "../db.js";

export const createContext = async (name, description) => {
    if (description)
        await sql`insert into context (name, description)
                  VALUES (${name}, ${description});`;

    else
        await sql`insert into context (name)
                  values (${name});`;

    const [created] = await sql`select context_id
                                from context
                                where name = ${name}`;

    const {context_id} = created
    return context_id
}

export const readContext = async (id) => {
    const [context] = await sql`select *
                                from context
                                where context_id = ${id}`
    return context;
}

export const updateContext = async (id, name, description) => {
    await sql`update context
              set name        = ${name},
                  description = ${description}
              where context_id = ${id}`

    const [updated] = await sql`select *
                                from context
                                where context_id = ${id}`;
    return updated;
}

export const deleteContext = async (id) => {
    // select the one to delete
    const [toDelete] = await sql`select *
                                 from context
                                 where context_id = ${id}`;
    console.log(toDelete);
    // if there is no record with such id
    if (!toDelete) return;
    // delete
    await sql`delete
              from context
              where context_id = ${id};`
    // if everything went well
    return toDelete;
}

export const listContext = async () => {
    return (await pool.query(`select *
                              from context;`)).rows
}
