import {pool, sql} from "../db.js";
import Router from "@koa/router";


const create = async ctx => {
    const {text, source_ref} = ctx.request.body;
    const result = (await  pool.query(`insert into use_example ("text", "source_ref") values ($1, $2) returning example_id;`, [text, source_ref])).rows[0]
    if(result) ctx.body = result;
}

const readUseExampleById = async (ctx) => {
    const {example_id} = ctx.params;
    const result = (await pool.query(`select * from use_example where example_id = ${example_id} limit 1`)).rows
    if (result) ctx.body = result[0];
}

const update = async ctx => {
    const {example_id} = ctx.params;
    const{text} = ctx.request.body;
    const{source_ref} = ctx.request.body;
    console.log(ctx.request.body)
    const modified = (await pool.query(`update use_example set text = $1, source_ref = $2 where example_id = $3 returning *;`, [text, source_ref, example_id])).rows
    if (modified) ctx.body = modified;
}

const del = async ctx => {
    const {example_id} = ctx.params;
    const result = (await pool.query(`delete from use_example where example_id = ${example_id} returning example_id`))
    ctx.body = result;
}

const listUseExamples = async  ctx => {
    const result = (await pool.query(`select * from use_example order by example_id`)).rows
    if (result) ctx.body = result
}

export default new Router()
    // create
    .post('/', create)
    // read
    .get('/:pos_id', readUseExampleById)
    // update
    .put('/:pos_id', update)
    // delete
    .delete('/:pos_id', del)
    // list
    .get('/', listUseExamples)