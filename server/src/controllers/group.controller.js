import {pool, sql} from "../../db.js";
import Router from "@koa/router";


const assignGroup = async ctx => {
    const {lexeme_id} = ctx.params
    const {id: group_id} = ctx.request.body
    const result = (await pool.query(`insert into belonging (lexeme, "group")
                                      values ($1, $2) retuning *`, [lexeme_id, group_id])).rows[0]
    if (result) ctx.body = result
}

const disconnectGroup = async ctx => {
    const {lexeme_id, group_id} = ctx.params
    const result = (await pool.query(`delete
                                      from belonging
                                      where lexeme = ${lexeme_id}
                                        and "group" = ${group_id} returning *`)).rows
    ctx.code
    200
    ctx.body = result
}
const assignMorpho = async (ctx) => {
    const {lexeme_id} = ctx.request.params;
    const {group_id} = ctx.request.body;
    const [morphological_group] = await sql`insert into morphological_group (lexeme, group)
                                            values (${lexeme_id}, ${group_id}) returning *;`
    ctx.body = morphological_group
}

const addBelonging = async (ctx) => {
    const {lexeme_id, group_id} = ctx.request.params;
    const [belonging] = await sql`insert into belonging (lexeme, group)
                                  values (${lexeme_id}, ${group_id}) returning *;`
    ctx.body = belonging
}

export default new Router()
//GROUPS//
    .post('/:lexeme_id/"group"', assignGroup)
    .delete('/:lexeme_id/"group"/:group_id', disconnectGroup)
    .post('/:lexeme_id/:group_id', addBelonging)
    .post('/:lexeme_id/"group"', assignMorpho)
