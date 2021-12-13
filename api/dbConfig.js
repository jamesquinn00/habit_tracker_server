const { MongoClient } = require('mongodb');

const dbUrl = process.env.DB_CONNECTION; // connection url
const dbName = process.env.DB_NAME; // db name

// Create a new MongoClient
const client = new MongoClient(dbUrl);

async function initConnection() {
    // Connect the client to the server
    await client.connect();
    console.log('Connected to database:', dbName);

    return client;
}

module.exports = { initConnection };