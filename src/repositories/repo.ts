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
        try {
            const userRef = firebase.collection('users').doc(data.name);
            const doc = await userRef.get();
            // DB 에 데이터 유무 확인 후 저장
            if (!doc.exists) {
                return userRef.set({
                    age : data.age,
                    address : data.address,
                    nickname : data.nickname
                });
            } else {
                throw new Error('Create Error => already exists');
            }
        } catch (err: unknown) {
            if (err instanceof Error) return err;
        }
    };

    getAllData = async () => {
        try {
            const dataList = await firebase.collection('users').get();
            if (dataList.empty) {
                throw new Error('Not exists any Data');
            }
            return dataList;
        } catch (err: unknown) {
            if (err instanceof Error) return err;
        }

    };

    updateData = async (newData: any) => {
        try {
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
            // 방법 3. 이거다 !
            const userRef = firebase.collection('users').doc(newData.name);

            // 수정 전 유저정보 유무 확인
            const doc = await userRef.get();
            if (!doc.exists) throw new Error('Username is not exists');

            let updateData: any = {};
            for (const prop in newData) {
                if (prop !== 'name') updateData[prop] = newData[prop];
            }
            console.log(updateData)
            return await userRef.update(updateData);
        } catch (err: unknown) {
            if (err instanceof Error) return err;
        }

    };

    deleteData = async (userName: string) => {
        try {
            const userRef = firebase.collection('users').doc(userName);

            // 삭제 전 유저정보 유무 확인
            const doc = await userRef.get();
            if (!doc.exists) throw new Error('Username is not exists');

            return await userRef.delete();
        } catch (err: unknown) {
            if (err instanceof Error) return err;
        }
    };
}

module.exports = new Firebase();