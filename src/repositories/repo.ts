const firebase = require('./index');

interface User {
    name: string;
    age: number;
    address: string;
    nickname: string;
}

// 'users' collection 에 'data.name'(이름)으로 doc 관리.
class Firebase {
    setData = async (data: User) => {
        return await firebase.collection('users').doc(data.name).set({
            age : data.age,
            address : data.address,
            nickname : data.nickname
        });
    };

    getAllData = async () => {
        const dataList = await firebase.collection('users').get();
        if (dataList.empty) {
            console.log('No data');
            return;
        }
        return dataList;
    };

    updateData = async (newData: any) => {
        // 방법 1.
        // for (let prop in data) {
        //     if(prop !== 'name') {
        //         await firebase.collection('users').doc(data.name).set({
        //             [`${prop}`] : data[prop]
        //         }, { merge : true });
        //     }
        // }
        // 방법 2.
        // const userData: any = (await firebase.collection('users').doc(newData.name).get()).data();
        // return await firebase.collection('users').doc(newData.name).update({
        //     age : newData.age ??= userData.age,
        //     address : newData.address ??= userData.address,
        //     nickname : newData.nickname ??= userData.nickname
        // });
        // 방법 3.
        let refData: any = {};
        for (const prop in newData) {
            if (prop !== 'name') refData[prop] = newData[prop];
        }
        return await firebase.collection('users').doc(newData.name).update(refData);
    };

    deleteData = async (userName: string) => {
        return await firebase.collection('users').doc(userName).delete();
    };
}

module.exports = new Firebase();