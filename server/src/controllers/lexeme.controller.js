import {sql} from "../db.js";
import Router from "@koa/router";

const list = async (ctx) => {
    // TODO
    const result = await sql`select *
                             from lexeme`
    if (result) ctx.body = result
}

const create = async (ctx) => {
    const {spelling, pos, definition} = ctx.request.body
    if (!spelling || !pos || !definition) {
        ctx.status = 400;
        return;
    }

    console.log({spelling, pos, definition});

    const [id] = await sql`insert into lexeme (part_of_speech, spelling, definition)
                           values (${pos}, ${spelling}, ${definition})
                           returning lexeme_id;`
    const {lexeme_id} = id;

    ctx.body = {lexeme_id, message: 'created'}
}

const createInflectedForm = async (ctx) => {
    const {lexeme_id} = ctx.request.params;
    const {category, spelling} = ctx.request.body;
    const [inflected_form] = await sql`insert into inflected_form (lexeme, category, spelling)
                                       values (${lexeme_id}, ${category}, ${spelling})
                                       returning *;`
    ctx.body = inflected_form
}

const readFull = async (ctx) => {
    const {lexeme_id} = ctx.request.params;
    const [lex] = await sql`select *
                            from lexeme
                            where lexeme_id = ${lexeme_id}`
    const {part_of_speech, spelling, definition} = lex;
    const [pos_name] = await sql`select *
                                 from part_of_speech
                                 where pos_id = ${part_of_speech}`;
    const [{lemma}] = await sql`select spelling.spelling as lemma
                                from spelling
                                where word_id = ${spelling}
                                limit 1`;
    const inflected = await sql`SELECT name, s.spelling as form
                                FROM paradigm_category
                                         JOIN inflected_form i ON paradigm_category.category_id = i.category
                                         JOIN spelling s ON s.word_id = i.spelling
                                where lexeme = ${lexeme_id}`
    const forms = {}
    inflected.forEach(({name, form}) => {
        Object.assign(forms, {[name]: form})
    })
    ctx.body = {lexeme_id, definition, part_of_speech: pos_name, lemma, forms}
}

export default new Router()
    .get('/', list)
    .get('/:lexeme_id/full', readFull)
    .post('/', create)
    .post('/:lexeme_id/inflected', createInflectedForm)