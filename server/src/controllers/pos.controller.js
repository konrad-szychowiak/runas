import {pool} from "../db.js";
import Router from "@koa/router";


const listPartsOfSpeech = async (ctx) => {
    // TODO
    const result = (await pool.query(`select *
                                      from part_of_speech
                                      order by pos_id`)).rows
    if (result) ctx.body = result
}


const readPartOfSpeechById = async (ctx) => {
    const {pos_id} = ctx.params;
    const result = (await pool.query(`select *
                                      from part_of_speech
                                      where pos_id = ${pos_id}
                                      limit 1`)).rows
    if (result) ctx.body = result[0]
}


const listCategoriesForPoSById = async (ctx) => {
    const {pos_id} = ctx.params;
    // todo

    const result = (await pool.query(`select *
                                      from paradigm_category
                                      where part_of_speech = ${pos_id}`)).rows
    if (result) ctx.body = result
}


const update = async ctx => {
    const {pos_id} = ctx.params;
    const {description, name} = ctx.request.body;
    console.log(ctx.request.body)
    const modified = (await pool.query(`update part_of_speech
                                        set description = $1,
                                            name        = $3
                                        where pos_id = $2
                                        returning *;`, [description, pos_id, name])).rows
    if (modified) ctx.body = modified;
}


const create = async ctx => {
    const {name: n, description: d} = ctx.request.body;
    const result = (await pool.query(`insert into part_of_speech ("name", "description")
                                      values ($1, $2)
                                      returning pos_id as id;`, [n, d])).rows[0]
    if (result) ctx.body = result
}


const del = async (ctx) => {
    const {pos_id} = ctx.params
    const result = (await pool.query(`delete
                                      from part_of_speech
                                      where pos_id = ${pos_id}
                                      returning pos_id`))
    ctx.body = result
}


const createCategory = async ctx => {
    const {pos_id} = ctx.params
    const {name: n} = ctx.request.body;

    const result = (await pool.query(`insert into paradigm_category ("name", part_of_speech)
                                      values ($1, $2)
                                      returning *`, [n, pos_id])).rows[0]
    if (result) ctx.body = result
}


const delCategory = async ctx => {
    const {pos_id, category_id} = ctx.params
    const result = (await pool.query(`delete
                                      from paradigm_category
                                      where category_id = ${category_id}
                                      returning *`, [])).rows[0]
    if (result) ctx.body = result
}

const updateCategory = async ctx => {
    const {pos_id, category_id} = ctx.params;
    // const {part_of_speech} = ctx.request.body;
    const {name} = ctx.request.body;
    const modified = (await pool.query(`update paradigm_category
                                        set name = $1
                                        where part_of_speech = ${pos_id}
                                          and category_id = ${category_id}
                                        returning *`, [name])).rows
    if (modified) ctx.body = modified;
}

export default new Router()
    // create
    .post('/', create)
    // read
    .get('/:pos_id', readPartOfSpeechById)
    // update
    .put('/:pos_id', update)
    // delete
    .delete('/:pos_id', del)
    // list
    .get('/', listPartsOfSpeech)

    // CATEGORIES //
    // POSCreate
    .post('/:pos_id/category/', createCategory)
    // Read
    // Update
    .put('/:pos_id/category/:category_id', updateCategory)
    // Delete
    .delete('/:pos_id/category/:category_id', delCategory)
    // List
    .get('/:pos_id/category', listCategoriesForPoSById)
