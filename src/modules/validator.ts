export const validator = (target: Record<string, any>) => { // Record type 이<key, type> 형식으로 객체의 키:값 이 있으면 <키: key, 값: type> 인 형태
    for (const key in target) { // Person 인스턴스를 파라미터로 넣어서 for 로 인스턴스 속성을 갖고있는만큼 돌려본다. validation 문제가 생기면 Error throw.
        target[key];
    }
};