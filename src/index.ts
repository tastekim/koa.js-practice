const Koa = require('koa');
const router = require('./router/router');
const { koaBody, HttpMethodEnum } = require('koa-body');

const app = new Koa();

app.use(koaBody({
    parseMethods :
        [HttpMethodEnum.GET, HttpMethodEnum.POST, HttpMethodEnum.PATCH, HttpMethodEnum.DELETE]
}));
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err: Error) => {
    console.log(`에러 내용 : ${err.message}`);
});

app.listen(8080);