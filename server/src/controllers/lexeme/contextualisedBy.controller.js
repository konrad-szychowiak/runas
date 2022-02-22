import {pool, sql} from "../db.js";
import Router from "@koa/router";

const deleteContextualised = async ctx => {
    const {lexeme_id} = cts.params;
    const result = (await pool.query(`delete
                                      from contextualised_by
                                      where lexeme = ${lexeme_id} returning *`))
    ctx.body = result
}

export default new Router()
    // delete
    .delete('/:lexeme_id/contextualised', deleteContextualised)
