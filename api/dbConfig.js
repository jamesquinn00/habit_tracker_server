const { MongoClient } = require('mongodb');

const dbUrl = process.env.DB_CONNECTION; // connection url
const dbName = process.env.DB_NAME; // db name

// Create a new MongoClient
const client = new MongoClient(dbUrl);

async function initDB() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected to database!', dbName);

        return client.db(dbName);
    } finally {
        // Ensure client will close when finished/error
        await client.close();
    }
}

module.exports = { initDB };