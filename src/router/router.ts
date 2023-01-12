import { Context, Next } from 'koa';
import { MinLength, isNum, isKorean, isNickname } from '../decorator/person-decorator';
import { validator } from '../modules/validator';
import koaBody from 'koa-body';

const Router = require('@koa/router');
const router = new Router();
const db = require('../repositories/repo');

// 입력된 데이터의 validation 에 쓰일 클래스
class Person {
    constructor(userInfo: any) {
        this.name = userInfo.name;
        this.age = userInfo.age;
        this.address = userInfo.address;
        this.nickname = userInfo.nickname;
    }

    @MinLength(4)
    public name: string;

    @isNum()
    public age: number;

    @isKorean()
    public address: string;

    @isNickname()
    public nickname: string;
}

router.get('/', async (ctx: Context, next: Next) => {
    try {
        const docs: any = await db.getAllData();
        if (docs instanceof Error) {
            ctx.status = 204;
            ctx.throw(docs.message);
        }
        let list: any[] = [];
        docs.forEach((doc: any) => {
            let name: string = doc.id;
            let info: object = doc.data();
            list.push({ name, info });
        });
        ctx.response.body = list;
        await next();
    } catch (err: unknown) {
        // unknown 타입으로 지정된 값은 타입을 먼저 확인한 후에 무언가를 할 수 있다.
        if (err instanceof Error) {
            ctx.body = { message : err.message };
            console.error(ctx.status, err.message);
        }
    }

});

router.post('/create', async (ctx: Context, next: Next) => {
    const userInfo: Person = ctx.request.body;
    try {
        // 방법 1. validator 를 decorator 를 이용해서 만들어보기
        const inputValue = new Person(userInfo);
        validator(inputValue);

        // 방법 2. interface 를 이용해서 만들어보기 => 런타임중엔 코드상에 인터페이스라는게 남아있지 않아서 실행 중 들어오는 데이터를 인터페이스가 확인해주질 못함.
        // const inputValue = new CreateValidator(userInfo);
        // if(!inputValue.isMinLength(2)) {
        //     throw new Error('validation Error => isMinLength')
        // }

        const result = await db.setData(userInfo);
        if (result.writeTime) {
            ctx.response.body = 'Create Success';
        } else {
            ctx.status = 400;
            ctx.throw(result.message);
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.body = { message : err.message };
            console.error(ctx.status, err.message);
        }
    }
});

router.patch('/update', async (ctx: Context, next: Next) => {
    try {
        const result = await db.updateData(ctx.request.body);
        if (result.writeTime) {
            ctx.response.body = 'Update Success';
        } else {
            ctx.status = 400;
            ctx.throw(result.message);
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.body = { message : err.message };
            console.error(ctx.status, err.message);
        }
    }
});

router.delete('/delete', async (ctx: Context, next: Next) => {
    try {
        console.log(ctx.request.body); // 갑자기 body를 받지를 못함. -> delete에서 payload body를 보낸다는 것 자체가 이상한거일수도...?
        const result = await db.deleteData(ctx.query.name); // 일단 name 을 query 로 넘겨서 해결 !
        if (result.writeTime) {
            ctx.response.body = 'Delete Success';
        } else {
            ctx.status = 400;
            ctx.throw(result.message); // 첫 번째 인자로 상태코드 주랬는데 깜빡하고 이렇게 썼는데도 잘 된다,,,?
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.body = { message : err.message };
            console.error(ctx.status, err.message);
        }
    }
});

module.exports = router;