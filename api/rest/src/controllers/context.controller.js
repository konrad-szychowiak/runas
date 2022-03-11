import Router from "@koa/router";
import {createContext, deleteContext, listContext, readContext, updateContext} from "../services/context.service.js";

/**
 * CREATE a new context.
 *
 * @param ctx koa context
 * @returns {Promise<void>}
 */
const create = async ctx => {
    const {name, description} = ctx.request.body
    // todo: constraints
    ctx.body = await createContext(name, description)
}

/**
 * READ a context by its ID.
 * @param ctx koa context
 * @returns {Promise<void>}
 */
const read = async ctx => {
    const {id} = ctx.params
    const context = await readContext(id)
    if (context) ctx.body = context
}

const update = async ctx => {
    const {id, name, description} = ctx.request.body
    // todo: validation
    const updated = await updateContext(id, name, description)
    if (updated) ctx.body = updated
}

const del = async ctx => {
    const {id} = ctx.params
    console.log(id)
    const deleted = await deleteContext(id)
    console.log(deleted)
    if (deleted) ctx.body = deleted
}

const list = async ctx => {
    ctx.body = await listContext()
}

export const contextController = new Router()
    // POSCreate
    .post('/', create)
    // LexemeRead
    .get('/:id', read)
    // Update
    .put('/', update)
    // Delete
    .delete('/:id', del)
    // List
    .get('/', list)

export default contextController;