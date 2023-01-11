import { Context, Next } from 'koa';
import { MinLength, isNum, isKorean, isNickname } from '../dto/person-decorator';
import { validator } from '../modules/validator';

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
        const docs: object[] = await db.getAllData();
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
            ctx.status = 400;
            ctx.body = { message : err.name };
            console.error(err.name);
        }
    }

});

router.post('/create', async (ctx: any, next: Next) => {
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
        if(result.writeTime) {
            ctx.response.body = 'Create Success';
        } else {
            throw result;
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.status = 400;
            ctx.body = { message : err.message };
            console.error(err.message);
        }
    }
});

router.patch('/update', async (ctx: any, next: Next) => {
    try {
        const result = await db.updateData(ctx.request.body);
        if(result.writeTime) {
            ctx.response.body = 'Update Success';
        } else {
            throw result;
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.status ??= 500;
            ctx.body = { message : err.message };
            console.error(err.name, err.message);
        }
    }
});

router.delete('/delete', async (ctx: any, next: Next) => {
    try {
        console.log(ctx)
        const result = await db.deleteData(ctx.request.body.name);
        if(result.writeTime) {
            ctx.response.body = 'Delete Success';
        } else {
            throw result;
        }
        await next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            ctx.status ??= 500;
            ctx.body = { message : err.message };
            console.error(err.name, err.message);
        }
    }
});

module.exports = router;