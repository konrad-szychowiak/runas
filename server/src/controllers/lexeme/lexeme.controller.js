import {pool, sql} from "../../db.js";
import Router from "@koa/router";

const list = async (ctx) => {
    // TODO
    const result = await sql`select lexeme_id      as id,
                                    s.spelling     as lemma,
                                    definition,
                                    name           as pos,
                                    word_id        as spelling_id,
                                    part_of_speech as pos_id
                             from lexeme
                                      join spelling s on lexeme.spelling = s.word_id
                                      join part_of_speech pos on lexeme.part_of_speech = pos.pos_id
                             order by lemma;`
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
    const contexts = (await pool.query(`select name,
                                               context_id
                                        from contextualised_by
                                                 join context on contextualised_by.context = context.context_id
                                        where contextualised_by.lexeme = ${lexeme_id};`)).rows
    ctx.body = {lexeme_id, definition, part_of_speech: pos_name, lemma, forms: inflected, contexts}
}

const assignContext = async ctx => {
    const {lexeme_id} = ctx.params
    const {id: context_id} = ctx.request.body
    const result = (await pool.query(`insert into contextualised_by (lexeme, context)
                                      values ($1, $2)
                                      returning *`, [lexeme_id, context_id])).rows[0]
    if (result) ctx.body = result
}

const disconnectContext = async ctx => {
    const {lexeme_id, context_id} = ctx.params
    const result = (await pool.query(`delete from contextualised_by 
                                      where lexeme = ${lexeme_id} and context = ${context_id}
                                      returning *`)).rows
    ctx.code = 200;
    ctx.body = result
}

export default new Router()
    .get('/', list)
    .get('/:lexeme_id/full', readFull)
    .post('/', create)
    .post('/:lexeme_id/inflected', createInflectedForm)

    // CONTEXTS //
    .post('/:lexeme_id/context', disconnectContext)
    .delete('/:lexeme_id/context/:context_id', disconnectContext)