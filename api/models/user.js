const { initDB } = require("../dbConfig")

module.exports = class User {
    constructor(data) {
        this.userEmail = data.userEmail
        this.passwordDigest = data.passwordDigest
        this.userName = data.userName
        this.refreshTokens = data.refreshTokens
    }

    static get all () {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                let result = await db.collection('users').find().toArray();
                let users = results.map(user => new User({userEmail: user.userEmail, userName: user.userName}));
                res(users);
            } catch (err) {
                rej('Error retrieving all users')
            }
        })
    }

    static findByEmail (email) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                let result = await db.collection('users').find({ userEmail: { $eq: email } });
                let user = new User(result.rows[0]);
                res(user);
            } catch (err) {
                rej('Error finding user by email');
            }
        })
    }

    static create (userData) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const { userEmail, passwordDigest, userName, refreshTokens } = userData
                await db.collection('users').insertOne({ userEmail, passwordDigest, userName, refreshTokens });
                const newUser = await User.findByEmail(userEmail);
                res(newUser);
            } catch (err) {
                rej(`Error creating user: ${err}`);
            }
        })
    }

    static clearRefreshTokens (email, token) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const clearedUser = await db.collection('users').updateOne(
                    { userEmail: email },
                    { $pull: { refreshTokens: { $eq: token } } }
                );
                res(clearedUser);
            } catch (err) {
                rej(`Error clearing access token for user ${email}`)
            }
        })
    }

    static pushToken (email, token) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const result = db.collection('users').updateOne(
                    { userEmail: email }, 
                    { $push: { refreshTokens: token } }
                );
                res(result);
            } catch (err) {
                rej(`Error pushing access token for user ${email}`)
            }
        })
    }
}
