require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt.js');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

async function register(req, res) {
    try {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt);
        await User.create({ ...req.body, password: hashed });
        res.status(201).json({ msg: "User created" });
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

        } else {
            throw new Error('User could not be authenticated');
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({ err });
    }
}