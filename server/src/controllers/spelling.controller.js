import * as spellingService from "../services/spelling.service.js";
import Router from "@koa/router";

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
    .post('/', spellingController.post)
    .delete('/', spellingController.delete)