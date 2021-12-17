import Router from "@koa/router";
import {createContext, deleteContext, listContext, readContext, updateContext} from "../services/context.service.js";

export const contextController =
    new Router()
        // Create
        .post('/', async ctx => {
            const {name, description} = ctx.request.body
            // todo: constraints
            ctx.body = await createContext(name, description)
        })
        // Read
        .get('/:id', async ctx => {
            const {id} = ctx.params
            console.log(id)
            const context = await readContext(id)
            console.log(context)
            if (context) ctx.body = context
        })
        // Update
        .put('/', async ctx => {
            const {id, name, description} = ctx.request.body
            // todo: validation
            const updated = await updateContext(id, name, description)
            if (updated) ctx.body = updated
        })
        // Delete
        .delete('/:id', async ctx => {
            const {id} = ctx.params
            console.log(id)
            const deleted = await deleteContext(id)
            console.log(deleted)
            if (!deleted) ctx.body = deleted
        })
        // List
        .get('/', async ctx => {
            ctx.body = await listContext()
        })

export default contextController;