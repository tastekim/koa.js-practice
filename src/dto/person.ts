// 데코레이터 팩토리로부터 들어오는 min 값을 value 와 비교한다.
export function isMinLength(value: unknown, min: number): boolean {
    return typeof value === 'string' && value.length >= min;
}

// 데코레이터 팩토리 및 데코레이터 함수
export function MinLength(min: number) { // 데코레이터로 쓰일 함수 | min 을 가지고 최소길이를 비교한다.
    return function (target: any, propertyKey: string): any { // 데코레이터 내용 | target 이랑 propertyKey 가 어디서 오는거지,,,?
        let value = target[propertyKey]; // value -> name 인데 name -> target[propertyKey] 라는 거고

        function validate() {
            if (!isMinLength(value, min)) {
                throw new Error('validation Error => MinLength');
            }
            return value;
        }

        function setter(newVal: number) { // 얘가 당최 모르겠다,,, newVal 은 뭐고 왜 타입이 number 지?
            value = newVal;
        }

        // getter, setter 를 추가해준다.
        return {
            get : validate,
            set : setter,
            enumerable: true
        };
    };
}