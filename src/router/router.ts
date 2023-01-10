import { Context, Next } from 'koa';

const Router = require('@koa/router');
const router = new Router();
const db = require('../repositories/repo');

router.get('/', async (ctx: Context, next: Next) => {
    const docs: object[] = await db.getAllData();
    let list: any[] = [];
    docs.forEach((doc: any) => {
        let name: string = doc.id;
        let info: object = doc.data();
        list.push({ name, info });
    });
    ctx.response.body = list;
    await next();
});

router.post('/create', async (ctx: any, next: Next) => {
    console.log(ctx.request)
});

router.patch('/update', async (ctx: any, next: Next) => {
    const result = await db.updateData(ctx.request.body);
    // if (result._writeTime) {
    //     ctx.body = 'Success';
    // } else {
    //     ctx.body = 'Fail';
    // }
    ctx.response.body = result.data();
    await next();
});

router.delete('/delete', async (ctx: any, next: Next) => {
    const result = await db.deleteData(ctx.request.body.name);
    if (result._writeTime) {
        ctx.response.body = 'Success';
    } else {
        ctx.body = 'Fail';
    }
    await next();
});

module.exports = router;