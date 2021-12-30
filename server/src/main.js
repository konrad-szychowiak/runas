import Koa from "koa";
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import spelling from "./controllers/spelling.controller.js";
import context from "./controllers/context.controller.js";
import pos from "./controllers/pos.controller.js";
import lexeme from "./controllers/lexeme.controller.js";
import cors from '@koa/cors'
const PORT = 8080
const app = new Koa();
const router = new Router({prefix: '/api'});

app.use(bodyParser())
app.use(cors())

router.use('/lexeme', lexeme.routes(), lexeme.allowedMethods())
router.use('/spelling', spelling.routes(), spelling.allowedMethods())
router.use('/context', context.routes(), context.allowedMethods())
router.use('/pos', pos.routes(), pos.allowedMethods())

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log('App listening on ' + PORT)
});