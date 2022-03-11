import Koa from "koa";
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import spelling from "./controllers/spelling.controller.js";
import context from "./controllers/context.controller.js";
import pos from "./controllers/pos.controller.js";
import example from "./controllers/examples.controller.js";
import lexeme from "./controllers/lexeme.controller.js";
import group from './controllers/group.controller.js'
import cors from '@koa/cors'
import logger from 'koa-logger'

const PORT = 8080

function main() {
    const app = new Koa();
    /**
     * Main koa router for the API.
     * @type {module:koa-router|Router}
     */
    const router = new Router({prefix: '/graphql'});

    app.use(logger())
    app.use(bodyParser())
    app.use(cors())

    router.use('/lexeme', lexeme.routes(), lexeme.allowedMethods())
    router.use('/spelling', spelling.routes(), spelling.allowedMethods())
    router.use('/context', context.routes(), context.allowedMethods())
    router.use('/pos', pos.routes(), pos.allowedMethods())
    router.use('/example', example.routes(), example.allowedMethods())
    router.use('/group', group.routes(), group.allowedMethods())

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(PORT, () => {
        console.log('App listening on ' + PORT)
    });
}

main()