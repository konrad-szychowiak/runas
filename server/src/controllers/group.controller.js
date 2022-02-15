import {pool} from "../db.js";
import Router from "@koa/router";


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
    const {description, coreLexeme} = ctx.request.body;
    const groupID = await Group(description);
    console.log(groupID)
    const result = (await pool.query(`insert into morphological_group (group_id, core)
                                      values ($1, $2)
                                      returning *`, [groupID, coreLexeme])).rows
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

export default new Router()
    //GROUPS//
    // CRU...
    .post('/morphological', createMorphologicalGroup)
    .get('/morphological', /* get Morphological Group */)
    .put('/morphological', /* update Morphological Group */)
    // CRU...
    .post('/semantic', createSemanticGroup)
    .get('/semantic', /* get semantic group */)
    .put('/semantic', /* update semantic group */)
    // D
    .delete('/:group_id', deleteGroup)
    // (L)
    .get('/', getGroups)
    // BELONGING //
    .post('/:group_id/lexeme/:lexeme_id', /* assign lexeme to group */)
    .delete('/:group_id/lexeme/:lexeme_id', /* unassign lexeme from a group */)
