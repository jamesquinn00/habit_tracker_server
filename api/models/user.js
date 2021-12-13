const { initDB } = require("../dbConfig")

module.exports = class User {
    constructor(data) {
        this.userEmail = data.userEmail
        this.passwordDigest = data.passwordDigest
        this.userName = data.userName
        this.refreshTokens = data.refreshTokens
    }

    static findByEmail (email) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                let result = await db.collection('users').find({ userEmail: {$eq: `${email}`}});
                let user = new User(result.rows[0]);
                res(user);
            } catch (err) {
                rej('Error');
            }
        })
    }

    static create (userData) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const { userEmail, passwordDigest, userName, refreshTokens } = userData
                await db.collection('users').insertOne({ userEmail, passwordDigest, userName, refreshTokens});
                const newUser = await User.findByEmail(userEmail);
                res(newUser);
            } catch (err) {
                rej(`Error creating user: ${err}`);
            }
        })
    }

    static update () {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                
                
            }
        })
    }

    static clearRefreshTokens (email, token) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const user = await User.findByEmail(email);
                const clearedUser = await db.collection('users')
                                            .find({ userEmail: {$eq: `${email}`}})
                                            .aggregate({$filter: {input: "$refreshTokens", as: "refreshToken", cond: { $ne: [ "$refreshTokens", token]}
                }})
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
                const user = await User.findByEmail(email);
                const result = db.collection('users').update({ userEmail: {$eq: `${email}`}}, {$set: { refreshTokens: refreshTokens.push(token)}})
                res(result)
            } catch (err) {
                rej(`Error pushing access token for user ${email}`)
            }
        })
    }
}
