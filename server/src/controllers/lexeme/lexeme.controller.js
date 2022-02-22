import {pool, sql} from "../../db.js";
import Router from "@koa/router";

const list = async (ctx) => {
    // TODO
    const result = (await pool.query(`select *
                                      from entry
                                      order by lemma;`)).rows
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
    const [inflected_form] = (await pool.query(`insert into inflected_form (lexeme, category, spelling)
                                                values (${lexeme_id}, ${category}, ${spelling})
                                                returning *;`)).rows
    ctx.body = inflected_form
}

const read = async ctx => {
    const {lexeme_id} = ctx.request.params;
    const lexeme = (await pool.query(`select *
                                      from entry
                                      where id = ${lexeme_id}
                                      limit 1`)).rows[0]
    if (!lexeme) return;
    console.log('lexeme with id', lexeme_id, "is:", lexeme)
}

const readFull = async (ctx) => {
    read(ctx);
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

    const inflected = await sql`SELECT name,
                                       s.spelling as form,
                                       category,
                                       lexeme
                                FROM paradigm_category
                                         JOIN inflected_form i ON paradigm_category.category_id = i.category
                                         JOIN spelling s ON s.word_id = i.spelling
                                where lexeme = ${lexeme_id}`

    const contexts = (await pool.query(`select name,
                                               context_id
                                        from contextualised_by
                                                 join context on contextualised_by.context = context.context_id
                                        where contextualised_by.lexeme = ${lexeme_id};`)).rows

    const examples = (await pool.query(`select example_id as id,
                                               text,
                                               source_ref as source
                                        from exemplified_by eb
                                                 join use_example ue on ue.example_id = eb.example
                                        where eb.lexeme = ${lexeme_id};`)).rows
    ctx.body = {lexeme_id, definition, part_of_speech: pos_name, lemma, forms: inflected, contexts, examples}
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
    const result = (await pool.query(`delete
                                      from contextualised_by
                                      where lexeme = ${lexeme_id}
                                        and context = ${context_id}
                                      returning *`)).rows
    ctx.code = 200;
    ctx.body = result
}

const del = async ctx => {
    const {lexeme_id} = ctx.params
    const result = (await pool.query(`delete
                                      from lexeme
                                      where lexeme_id = $1
                                      returning *`, [lexeme_id]))
    ctx.body = result
}

const assignExample = async ctx => {
    const {lexeme_id, example_id} = ctx.params
    const result = (await pool.query(`insert into exemplified_by (lexeme, example)
                                      VALUES ($1, $2)
                                      returning *`, [lexeme_id, example_id]))
    ctx.body = result
}

export default new Router()
    .post('/', create)
    .get('/', list)
    .get('/:lexeme_id/full', readFull)
    .delete('/:lexeme_id', del)

    // INFLECTED FORM //
    .post('/:lexeme_id/inflected', createInflectedForm)

    // CONTEXTS //
    .post('/:lexeme_id/context', assignContext)
    .delete('/:lexeme_id/context/:context_id', disconnectContext)

    // EXAMPLES //
    .post(`/:lexeme_id/example/:example_id`, assignExample)