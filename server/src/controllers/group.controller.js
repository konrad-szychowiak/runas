import {pool} from "../db.js";
import Router from "@koa/router";
import _ from "lodash";


const Group = async (description) => {
    const [createdGroup] = (await pool.query(`insert into "group" (description)
                                              values ($1)
                                              returning group_id;`, [description])).rows
    console.log(createdGroup)
    return createdGroup.group_id
}

const assignGroup = async ctx => {
    const {lexeme_id} = ctx.params
    const {id: group_id} = ctx.request.body
    const result = (await pool.query(`insert into belonging (lexeme, "group")
                                      values ($1, $2)
                                      returning *`, [lexeme_id, group_id])).rows[0]
    if (result) ctx.body = result
}

const disconnectGroup = async ctx => {
    const {lexeme_id, group_id} = ctx.params
    const result = (await pool.query(`delete
                                      from belonging
                                      where lexeme = ${lexeme_id}
                                        and "group" = ${group_id}
                                      returning *`)).rows
    ctx.code
    200
    ctx.body = result
}

const addBelonging = async (ctx) => {
    const {lexeme_id, group_id} = ctx.request.params;
    const [belonging] = await sql`insert into belonging (lexeme, "group")
                                  values (${lexeme_id}, ${group_id})
                                  returning *;`
    ctx.body = belonging
}

const getGroups = async ctx => {
    const morphoPromise = pool.query(`select *
                                      from full_morphological_group_view`)

    const semanticPromise = pool.query(`select *
                                        from full_semantic_group_view`)

    const result = [
        ...(await morphoPromise).rows,
        ...(await semanticPromise).rows
    ]

    if (result)
        ctx.body = result
}

const createMorphologicalGroup = async ctx => {
    const {description, core} = ctx.request.body;
    const groupID = await Group(description);
    console.log(groupID)
    const result = (await pool.query(`insert into morphological_group (group_id, core)
                                      values ($1, $2)
                                      returning *`, [groupID, core])).rows
    console.log(result)
    ctx.body = {id: groupID, status_verbose: "Added"}
}

const createSemanticGroup = async ctx => {
    const {description, meaning} = ctx.request.body;
    const groupID = await Group(description);
    console.log(groupID)
    const result = (await pool.query(`insert into semantic_group (group_id, meaning)
                                      values ($1, $2)
                                      returning *`, [groupID, meaning])).rows
    console.log(result)
    ctx.body = {id: groupID, status_verbose: "Added"}
}

const deleteGroup = async ctx => {
    const {group_id} = ctx.request.params;
    console.log("deleting...", group_id)
    const [result] = (await pool.query(`delete
                                        from "group"
                                        where group_id = $1
                                        returning *`, [group_id])).rows
    console.log(result)
    if (result)
        ctx.body = result
}

const updateDescription = async (id, description) => {
    if (!description) return;
    const result = (await pool.query(`update "group"
                                      set description = $1
                                      where group_id = $2`, [description, id])).rows
    return result;
}

const updateMorphologicalGroup = async ctx => {
    const {group_id} = ctx.params;
    const {coreLexeme} = ctx.request.body;
    await pool.query(`update morphological_group
                      set core = $1
                      where group_id = $2`, [coreLexeme, group_id])

    ctx.body = result;
}

const updateSemanticGroup = async ctx => {
    const {group_id} = ctx.params;
    const {meaning, description} = ctx.request.body;

    await updateDescription(group_id, description);

    await pool.query(`update semantic_group
                      set meaning = $1
                      where group_id = $2
                      returning *;`, [meaning, group_id])

    const [result] = (await pool.query(`select *
                                        from full_semantic_group_view
                                        where id = ${group_id}
                                        limit 1`)).rows

    if (result) ctx.body = result;
}

const createBelonging = async ctx => {
    const {group_id, lexeme_id} = ctx.params;
    const result = (await pool.query(`insert into belonging (lexeme, "group")
                                      values ($1, $2)
                                      returning *`, [lexeme_id, group_id])).rows[0]
    ctx.body = result;
}

const deleteBelonging = async ctx => {
    const {group_id, lexeme_id} = ctx.params;
    const result = (await pool.query(`delete
                                      from belonging
                                      where lexeme = ${lexeme_id}
                                        and "group" = ${group_id}
                                      returning *`)).rows
    ctx.body = result;
}

const readGroup = async ctx => {
    const {group_id} = ctx.params;
    // const result = (await pool.query(`select *
    //                                   from (case when exists (select * from morphological_group where group_id = ${group_id}) then morphological_group else semantic_group end)
    //                                   where group_id = ${group_id}`)).rows[0]

    const m = (await pool.query(`select *
                                 from full_morphological_group_view
                                 where id = ${group_id}`)).rows
    const s = (await pool.query(`select *
                                 from full_semantic_group_view
                                 where id = ${group_id}`)).rows

    const result = [...m, ...s]

    console.log({result})

    if (result) ctx.body = result[0];
}

const assignLexemes = async ctx => {
    const {group_id} = ctx.params;
    const {lexemes} = ctx.request.body

    console.log(lexemes)
    console.log('  --> DEBUG', group_id, lexemes)

    let removed;

    if (lexemes.length === 0)
        removed = (await pool.query(`delete
                                     from belonging
                                     where "group" = ${group_id}
                                     returning lexeme`))
            .rows
            .map(el => el.lexeme)

    else
        removed = (await pool.query(`delete
                                     from belonging
                                     where "group" = ${group_id}
                                       and lexeme != any ($1)
                                     returning lexeme`, [lexemes]))
            .rows
            .map(el => el.lexeme)

    const existing = (await pool.query(`select lexeme
                                        from belonging
                                        where "group" = ${group_id};`))
        .rows
        .map(el => el.lexeme)

    const remaining = _.difference(lexemes, existing)
    console.log({removed}, {existing}, {remaining})
    const log = await Promise.all(remaining.flatMap(async lexeme_id => (await pool.query(`insert into belonging ("group", lexeme)
                                                                                          values (${group_id},
                                                                                                  ${lexeme_id})
                                                                                          returning *`)).rows))
    console.log(log)
    ctx.body = {group: group_id, lexemes: [...existing, ...remaining], removed}
}


const getLexemes = async ctx => {
    const {group_id} = ctx.params;
    const lexemes = await pool.query(`select lexeme.*
                                      from lexeme
                                               inner join belonging b on lexeme.lexeme_id = b.lexeme
                                      where "group" = $1`, [group_id])
    ctx.body = lexemes.rows;
}

export default new Router()
    //GROUPS//
    //R
    .get('/:group_id', readGroup)

    // CRU...
    .post('/morphological', createMorphologicalGroup)
    .get('/morphological', /* get Morphological Group */)
    .put('/:group_id/morphological', updateMorphologicalGroup)
    // CRU...
    .post('/semantic', createSemanticGroup)
    .get('/semantic', /* get semantic group */)
    .put('/:group_id/semantic', updateSemanticGroup)
    // D
    .delete('/:group_id', deleteGroup)
    // (L)
    .get('/', getGroups)

    // BELONGING //
    .post('/:group_id/lexeme/:lexeme_id', createBelonging)
    .delete('/:group_id/lexeme/:lexeme_id', deleteBelonging)

    .put('/:group_id/lexeme', assignLexemes)
    .get('/:group_id/lexeme', getLexemes)
