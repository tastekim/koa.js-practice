const Koa = require('koa');
const router = require('./router/router');
const { koaBody } = require('koa-body');

const app = new Koa();

app.use(koaBody());
app.use(router.routes()).use(router.allowedMethods());
app.on('error', (err: Error) => {
    console.log(`에러 내용 : ${err.message}`);
});

app.listen(8080);