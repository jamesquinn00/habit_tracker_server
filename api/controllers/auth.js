require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

async function register(req, res) {
    try {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({ userEmail: req.body.email, userName: req.body.userName, passwordDigest: hashed });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ err });
    }
}

async function login(req, res) {
    try {
        const user = await User.findByEmail(req.body.email);
        if (!user) throw new Error('No user with this email');
        // decrypt and compare passwordDigest with entered password
        const authed = bcrypt.compare(req.body.password, user.passwordDigest);
        // create login token if password is correct
        if (!!authed) {
            const payload = { userEmail: user.userEmail, userName: user.userName }
            
            // generate access and refresh tokens
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
            // add the refresh token to user's data
            await User.pushToken(user.userEmail, `Bearer ${refreshToken}`);
            res.status(200).json({ accessToken: `Bearer ${accessToken}`, refreshToken: `Bearer ${refreshToken}` });
        } else {
            throw new Error('User could not be authenticated');
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({ err });
    }
}

async function token(req, res) {
    try {
        const user = await User.findByEmail(req.body.email);
        if (!user) throw new Error('No user with this email');
        const payload = { userEmail: user.userEmail, userName: user.userName }
        const refreshToken = req.body.token;

        // check if refreshToken is null
        if (refreshToken == null) throw new Error('null token');

        // check is refreshToken is still valid or has been removed
        if (!user.refreshTokens.includes(refreshToken)) throw new Error('Invalid token');

        // verify the refresh token
        jwt.verify(refreshToken.split(' ')[1], process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
            res.status(200).json({ accessToken: `Bearer ${accessToken}` });
        });
    } catch (err) {
        console.log(err);
        if (err == 'Error: null token') { 
            return res.sendStatus(401);
        }
        res.sendStatus(403);
    }
} 

async function logout(req, res) {
    try {
        console.log(req.body.email);
        const user = await User.findByEmail(req.body.email);
        if (!user) throw new Error('No user with this email');

        User.clearRefreshTokens(user.userEmail, req.body.token);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(500);
    }
}

module.exports = {
    register,
    login,
    token,
    logout
}