const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("../../fir-firestore-prac-ac2c4-firebase-adminsdk-53bjr-3bf68897cc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = firestore.getFirestore();

module.exports = db;