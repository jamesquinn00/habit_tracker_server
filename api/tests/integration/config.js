const request = require('supertest');
const app = require('../../server');
const { initConnection } = require('../../dbConfig');

const dbName = process.env.DB_NAME;

function resetTestDB() {
    return new Promise(async (resolve, reject) => {
        try {
            // init client connection to db
            const client = await initConnection();
            // init database
            const db = client.db(dbName);
            // drop the users collection
            db.collection("users").drop((err) => {
                if (err) throw err;
            });
            // drop the habits collection
            db.collection('habits').drop((err) => {
                if (err) throw err;
            });
            // insert test data
            await db.collection("users").insertMany([
                { 
                    id: 1,
                    userEmail: "testUser1@email.com",
                    passwordDigest: "password",
                    refreshTokens: ['Bearer 123'],
                    userName: "test user 1",
                },
                { 
                    id: 2,
                    userEmail: "testUser2@email.com",
                    passwordDigest: "password",
                    refreshTokens: [],
                    userName: "test user 2",
                },
                { 
                    id: 3,
                    userEmail: "testUser3@email.com",
                    passwordDigest: "password",
                    refreshTokens: [],
                    userName: "test user 3",
                },
            ]);

            //insert habits data
            await db.collection('habits').insertMany([
                {
                    id: 1,
                    userEmail: "testUser1@email.com",
                    userName: "test user 1",
                    habitName: "Water",
                    frequency: 1,
                    unit: "cups",
                    amount: { expected: 8 ,  current: 0 },
                    streak: { top: 5, current: 3 },
                    lastLog: "2021-12-11T11:31:21.988Z"
                },
                {
                    id: 2,
                    userEmail: "testUser2@email.com",
                    userName: "test user 2",
                    habitName: "Walk the Dog",
                    frequency: 1,
                    unit: "times",
                    amount: { expected: 2, current: 1 },
                    streak: { top: 10, current: 10 },
                    lastLog: "2021-12-10T11:31:21.988Z"
                },
                {
                    id: 3,
                    userEmail: "testUser2@email.com",
                    userName: "test user 2",
                    habitName: "Water",
                    frequency: 1,
                    unit: "cups",
                    amount: { expected: 6, current: 4 },
                    streak: { top: 7, current: 1 },
                    lastLog: "2021-12-11T11:31:21.988Z"
                },
                {
                    id: 4,
                    userEmail: "testUser3@email.com",
                    userName: "test user 3",
                    habitName: "Running",
                    frequency: 7,
                    unit: "km",
                    amount: { expected: 5, current: 2.7 },
                    streak: { top: 15, current: 15 },
                    lastLog: "2021-12-09T11:31:21.988Z"
                }
            ]);
            // close the connection to db
            client.close(); 
            resolve(`${dbName} reset for testing`);
        } catch (err) {
            reject(`Test DB could not be reset: ${err} in ${err.file}`);
        }
    });
}

global.request = request;
global.app = app;
global.resetTestDB = resetTestDB;
global.port = process.env.PORT || 5000;