import { CustomError } from 'ts-custom-error';

class MyError extends CustomError {
    constructor() {
        super();
        Object.defineProperty(this, 'name', { value : 'MyError' });
    }

}