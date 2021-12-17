import Koa from "koa";
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import spelling from "./controllers/spelling.controller.js";
import context from "./controllers/context.controller.js";

const PORT = 8080
const app = new Koa();
const router = new Router({prefix: '/api'});

app.use(bodyParser())

router.use('/spelling', spelling.routes(), spelling.allowedMethods())
router.use('/context', context.routes(), context.allowedMethods())

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log('App listening on ' + PORT)
});