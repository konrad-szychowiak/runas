import {sql} from "../db.js";
import Router from "@koa/router";

const listPartsOfSpeech = async (ctx) => {
    // TODO
    const result = await sql`select *
                         from part_of_speech`
    if (result) ctx.body = result
}

const listCategoriesForPoSById = async (ctx) => {
    const {pos_id} = ctx.params;
    // todo
    const result = await sql`select *
                         from paradigm_category
                         where part_of_speech = ${pos_id}`
    if (result) ctx.body = result
}

export default new Router()
    .get('/', listPartsOfSpeech)
    .get('/:pos_id/category', listCategoriesForPoSById)