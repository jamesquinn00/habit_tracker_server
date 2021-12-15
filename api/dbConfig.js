const { MongoClient } = require('mongodb');

const dbUrl = process.env.DB_CONNECTION; // connection url
const dbName = process.env.DB_NAME; // db name

async function initConnection() {
    // Create a new MongoClient
    const client = new MongoClient(dbUrl);
    // Connect the client to the server
    await client.connect();

    return client;
}

async function initDB() {
    const client = await initConnection();
    console.log(`connected to database ${dbName}`);
    return client.db(dbName);
}

module.exports = { 
    initConnection,
    initDB 
};