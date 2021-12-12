const { initDB } = require("../dbConfig")

class User {
    constructor(data) {
        this.userEmail = data.userEmail
        this.passwordDigest = data.passwordDigest
        this.userName = data.userName
        this.habits = data.habits
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
                const { userEmail, passwordDigest, userName, habits, refreshTokens } = userData
                await db.users.insertOne({ userEmail, passwordDigest, userName, habits, refreshTokens});
                const newUser = await User.findByEmail(userEmail);
                res(newUser);
            } catch (err) {
                rej(`Error creating user: ${err}`);
            }
        })
    }

    update () {
// to be continued.....
    }

    static clearRefreshTokens (email) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const user = await User.findByEmail(email);
                const clearedUser = {...user, refreshTokens: []}
                res(clearedUser);
            } catch (err) {
                rej(`Error clearing refresh tokens for user ${email}`)
            }
        })
    }
}

module.exports = User