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

    updateData = async (data: any) => {
        for (let prop in data) {
            if(prop !== 'name') {
                await firebase.collection('users').doc(data.name).set({
                    [`${prop}`] : data[prop]
                }, { merge : true });
            }
        }
        return await firebase.collection('users').doc(data.name).get();
        // return await firebase.collection('users').doc(data.name).set({
        //     age : data.age,
        //     address : data.address,
        //     nickname : data.nickname
        // }, { merge : true });
    };

    deleteData = async (userName: string) => {
        return await firebase.collection('users').doc(userName).delete();
    };
}

module.exports = new Firebase();