import {pool, sql} from "../db.js";
import Router from "@koa/router";
import _ from "lodash";


const create = async ctx => {
    const {text, source} = ctx.request.body;
    const result = (await pool.query(`insert into use_example ("text", "source_ref")
                                      values ($1, $2)
                                      returning example_id;`, [text, source])).rows[0]
    if (result) ctx.body = result;
}

const readUseExampleById = async (ctx) => {
    const {example_id} = ctx.params;
    const result = (await pool.query(`select *
                                      from use_example
                                      where example_id = ${example_id}
                                      limit 1`)).rows[0]
    if (!result) return;
    const usage = (await pool.query(`select *
                                     from exemplified_by
                                     where example = ${example_id};`)).rows
    ctx.body = {...result, usage};
}

const update = async ctx => {
    const {example_id} = ctx.params;
    const {text} = ctx.request.body;
    const {source} = ctx.request.body;
    console.log(ctx.request.body)
    const modified = (await pool.query(`update use_example
                                        set text       = $1,
                                            source_ref = $2
                                        where example_id = $3
                                        returning *;`, [text, source, example_id])).rows
    if (modified) ctx.body = modified;
}

const del = async ctx => {
    const {example_id} = ctx.params;
    const result = (await pool.query(`delete
                                      from use_example
                                      where example_id = ${example_id}
                                      returning example_id`))
    if (result) ctx.body = result;
}

const listUseExamples = async ctx => {
    const result = (await pool.query(`select *
                                      from use_example
                                      order by example_id`)).rows
    if (result) ctx.body = result
}

/**
 * Assign specific lexemes, by their IDs, to a given use example.
 * @param ctx
 * @returns {Promise<void>}
 */
const assignLexemes = async ctx => {
    const {example_id} = ctx.params;
    const {lexemes} = ctx.request.body

    console.log(lexemes)
    console.log('  --> DEBUG', example_id, lexemes)

    const removed = (await pool.query(`delete
                                       from exemplified_by
                                       where example = ${example_id}
                                         and lexeme != any ($1)
                                       returning lexeme`, [lexemes]))
        .rows
        .map(el => el.lexeme)

    const existing = (await pool.query(`select lexeme
                                        from exemplified_by
                                        where example = ${example_id};`))
        .rows
        .map(el => el.lexeme)

    const remaining = _.difference(lexemes, existing)
    console.log({removed}, {existing}, {remaining})
    const log = await Promise.all(remaining.flatMap(async lexeme_id => (await pool.query(`insert into exemplified_by (example, lexeme)
                                                                                          values (${example_id},
                                                                                                  ${lexeme_id})
                                                                                          returning *`)).rows))
    console.log(log)
    ctx.body = {example: example_id, lexemes: [...existing, ...remaining], removed}
}

export default new Router()
    // create
    .post('/', create)
    // read
    .get('/:example_id', readUseExampleById)
    // update
    .put('/:example_id', update)
    // delete
    .delete('/:example_id', del)
    // list
    .get('/', listUseExamples)

    // assign
    .post('/:example_id/assign', assignLexemes)