import {pool, sql} from "../db.js";
import Router from "@koa/router";

const list = async (ctx) => {
    // TODO
    const result = (await pool.query(`select *
                                      from entry
                                      order by lemma;`)).rows
    if (result) ctx.body = result
}

const create = async (ctx) => {
    const {spelling /* text */, pos, definition} = ctx.request.body
    if (!spelling || !pos || !definition) {
        ctx.status = 400;
        return;
    }

    console.log({spelling, pos, definition});

    const [id] = await sql`insert into lexeme (part_of_speech, spelling, definition)
                           values (${pos}, branch_off_spelling(${spelling}), ${definition})
                           returning lexeme_id;`
    const {lexeme_id} = id;

    ctx.body = {lexeme_id, message: 'created'}
}

const createInflectedForm = async (ctx) => {
    const {lexeme_id} = ctx.request.params;
    const {category, spelling} = ctx.request.body;
    const [inflected_form] = (await pool.query(`insert into inflected_form (lexeme, category, "spelling")
                                                values (${lexeme_id}, ${category}, branch_off_spelling($1))
                                                returning *;`, [spelling])).rows
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
    // read(ctx);
    const {lexeme_id} = ctx.request.params;
    const [lex] = (await pool.query(`select *
                                     from lexeme
                                     where lexeme_id = ${lexeme_id}`)).rows

    const {part_of_speech, spelling, definition} = lex;

    const [pos_name] = (await pool.query(`select *
                                          from part_of_speech
                                          where pos_id = ${part_of_speech}`)).rows

    const [{lemma}] = (await pool.query(`select spelling.spelling as lemma
                                         from spelling
                                         where word_id = ${spelling}
                                         limit 1`)).rows

    const inflected = (await pool.query(`SELECT name,
                                                s.spelling as form,
                                                category,
                                                lexeme
                                         FROM paradigm_category
                                                  JOIN inflected_form i ON paradigm_category.category_id = i.category
                                                  JOIN spelling s ON s.word_id = i.spelling
                                         where lexeme = ${lexeme_id}
                                         order by category`)).rows

    const contexts = (await pool.query(`select name,
                                               context_id,
                                               description
                                        from contextualised_by
                                                 join context on contextualised_by.context = context.context_id
                                        where contextualised_by.lexeme = ${lexeme_id};`)).rows

    const examples = (await pool.query(`select text,
                                               example_id,
                                               source_ref as source
                                        from exemplified_by
                                                 join use_example example on exemplified_by.example = example.example_id
                                        where exemplified_by.lexeme = ${lexeme_id};`)).rows

    const belongings = (await pool.query(`select description, group_id
                                          from belonging
                                                   join "group" on belonging."group" = "group".group_id
                                          where belonging.lexeme = ${lexeme_id};`)).rows

    ctx.body = {
        lexeme_id,
        definition,
        part_of_speech: pos_name,
        lemma,
        forms: inflected,
        contexts,
        examples,
        groups: belongings
    }
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
    const {lexeme_id} = ctx.params
    const {id: example_id} = ctx.request.body
    const result = (await pool.query(`insert into exemplified_by (lexeme, example)
                                      values ($1, $2)
                                      returning *`, [lexeme_id, exmaple_id])).rows[0]
    if (result) ctx.body = result
}

const deleteExemplified = async ctx => {
    const {lexeme_id, example_id} = ctx.params
    const result = (await pool.query(`delete
                                      from exemplified_by
                                      where lexeme = ${lexeme_id}
                                        and example = ${example_id}
                                      returning *`)).rows
    ctx.code = 200;
    ctx.body = result
}

const readExamples = async ctx => {
    const {lexeme_id} = ctx.params
    const result = (await pool.query(`select *
                                      from exemplified_by
                                      where lexeme = ${lexeme_id}`)).rows
    if (result) ctx.body = result
}

const updateInflectedForm = async ctx => {
    const {lexeme_id} = ctx.params
    const {category} = ctx.request.body
    const {spelling /* that's a text */} = ctx.request.body

    console.log(category, spelling)

    const modified = (await pool.query(`update inflected_form
                                        set spelling = branch_off_spelling($2)
                                        where lexeme = $3
                                          and category = $1
                                        returning *;`, [category, spelling, lexeme_id])).rows
    if (modified) ctx.body = modified
}

const deleteInflectedForm = async ctx => {
    const {lexeme_id} = ctx.params
    const result = (await pool.query(`delete
                                      from inflected_form
                                      where lexeme = $1
                                      returning *`, [lexeme_id])).rows
    ctx.body = result
}

const updateDefinition = async ctx => {
    const {id, definition} = ctx.request.body
    await pool.query(`update lexeme
                      set definition = $1
                      where lexeme_id = $2;`, [definition, id])
    const [result] = (await pool.query(`select *
                                        from entry
                                        where id = $1
                                        limit 1`, [id])).rows
    ctx.body = result
}

const updateLemma = async ctx => {
    const {id, lemma /* a text */} = ctx.request.body
    await pool.query(`update lexeme
                      set spelling = branch_off_spelling($1)
                      where lexeme_id = $2;`, [lemma, id])
    const [result] = (await pool.query(`select *
                                        from entry
                                        where id = $1
                                        limit 1`, [id])).rows
    console.log(result)
    ctx.body = result
}

const updateContexts = async ctx => {
    const {lexeme_id} = ctx.params;
    const {contexts} = ctx.request.body

    await pool.query(`delete
                      from contextualised_by
                      where context = any ($1)
                        and lexeme = ${lexeme_id}
                      returning lexeme`, [contexts])

    const done = await Promise.all(contexts.flatMap(async contextID => (await pool.query(`
        insert into contextualised_by (lexeme, context)
        VALUES (${lexeme_id}, ${contextID})
    `)).rows))

    ctx.body = {contexts: done}
}

export default new Router()
    .post('/', create)
    .get('/', list)
    .get('/:lexeme_id/full', readFull)
    .delete('/:lexeme_id', del)
    .put('/def', updateDefinition)
    .put('/lemma', updateLemma)

    // INFLECTED FORM //
    .post('/:lexeme_id/inflected', createInflectedForm)
    //update
    .put('/:lexeme_id/inflected', updateInflectedForm)
    //delete
    .delete('/"lexeme_id/inflected', deleteInflectedForm)

    // CONTEXTS //
    .post('/:lexeme_id/context', assignContext)
    .delete('/:lexeme_id/context/:context_id', disconnectContext)
    .put('/:lexeme_id/context/', updateContexts)


    //EXAMPLE//
    /**
     * @deprecated
     */
    .post('/:lexeme_id/example', assignExample)
    .delete('/:lexeme_id/example/:example_id', deleteExemplified)
    .get('/:lexeme_id/example', readExamples)
