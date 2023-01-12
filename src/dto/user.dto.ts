export class UserDto {
    name: string;
    age: number;
    address: string;
    nickname: string;

    constructor(userData: any) {
        this.name = userData.name;
        this.age = userData.age;
        this.address = userData.address;
        this.nickname = userData.nickname;
    }
}