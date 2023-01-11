// 데코레이터 팩토리로부터 들어오는 min 값을 value 와 비교한다.
export function isMinLength(value: unknown, min: number): boolean {
    return typeof value === 'string' && value.length >= min;
}


// 데코레이터 팩토리 및 데코레이터 함수
export function MinLength(min: number) { // 데코레이터로 쓰일 함수 | min 을 가지고 최소길이를 비교한다.
    return function (target: any, propertyKey: string): any { // 데코레이터 내용 | target 에는 해당 class 의 prototype, prototypeKey 에는 해당 method 의 key 가 들어온다.
        let value = target[propertyKey]; // prototypeKey 는 'name' 이라고 잘 뜨는데 그럼 target 은 왜 undefined 지,,?
        // 여기다 console.log 로 찍으니까 decorator 가 런타임시 먼저 호출되기 때문에 target 이 비어있는 상태로 찍히고 데이터를 넣었을 때는 {getter/setter} 잘 나온다..

        function validate() {
            if (!isMinLength(value, min)) {
                throw new Error('validation Error => MinLength');
            }
            return value;
        }

        function setter(newVal: string) { // 얘가 당최 모르겠다,,, newVal 은 뭐고 왜 타입이 number 지? | string 도 되네,,,?
            value = newVal; // 추측: newVal 을 찍어보면 새로 입력된 name 값이 들어온다. 위에 타입이 number 여도 문제가 없던건 런타임 환경이기 때문에 타입이 의미가 없기 때문이지 않을까
        }

        // getter, setter 를 추가해준다.
        return {
            get : validate,
            set : setter,
            enumerable : true
        };
    };
}

export function isNum() {
    return function (target: any, propertyKey: string): any {
        let value = target[propertyKey];
        const regExp = new RegExp(/\d/g);

        function validate() {
            if (!regExp.test(value) || typeof value === 'undefined') {
                throw new Error('validation Error => isNum');
            }
            return value;
        }

        function setter(newVal: string): void {
            value = newVal;
        }

        return {
            get : validate,
            set : setter,
            enumerable : true
        };
    };
}


export function isKorean() {
    return function (target: any, propertyKey: string): any {
        const arr = ['Seoul', 'Busan', 'Incheon', 'Daegu'];
        let value = target[propertyKey]; // address

        function validate() {
            if (!arr.includes(value) || typeof value === 'undefined') {
                throw new Error('validation Error => isKorean');
            }
            return value;
        }

        function setter(newVal: string) {
            value = newVal;
        }

        return {
            get : validate,
            set : setter,
            enumerable : true
        };
    };
}

export function isNickname() {
    return function (target: any, propertyKey: string): any {
        let value = target[propertyKey];
        const regExp = new RegExp('[a-zA-Z0-9]');

        function validate() {
            if (!regExp.test(value) || typeof value === 'undefined') {
                throw new Error('validation Error => isNickname');
            }
            return value;
        }

        function setter(newVal: string) {
            value = newVal;
        }

        return {
            get : validate,
            set : setter,
            enumerable : true
        };
    };
}