import * as spellingService from "../services/spelling.service.js";
import Router from "@koa/router";
import {sql} from "../db.js";

export const spellingController = {

    getAll: async (ctx) => {
        const all = await spellingService.listSpelling()
        console.log(all)
        ctx.body = all
    },

    getOne: async (ctx) => {
        const {id} = ctx.params
        const one = await spellingService.readSpelling(id)
        console.log(one)
        if (one) ctx.body = one
    },

    post: async (ctx) => {
        const {spelling} = ctx.request.body
        ctx.body = await spellingService.createSpelling(spelling)
    },

    delete: async ctx => {
        // arrange
        const ids = ctx.request.body;

        // act
        console.log(ids)
        ctx.body = await spellingService.deleteMany(ids)
    }
}

export default new Router()
    .get('/', spellingController.getAll)
    .get('/:id', spellingController.getOne)
    .delete('/', spellingController.delete)
    .post('/', async (ctx) => {
        const {text} = ctx.request.body
        const [foo] = await sql`select *
                              from spelling
                              where spelling.spelling = ${text}`
        if(foo) {
            ctx.body = { ...foo, message: 'existed' };
            return
        }
        await sql`insert into spelling (spelling)
                  values (${text});`
        const [bar] = await sql`select *
                              from spelling
                              where spelling.spelling = ${text}`
        ctx.body = { ...bar, message: 'created' };
    })