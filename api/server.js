const express = require('express');
const cors = require('cors');

const usersRoute = require('./routes/users');
const habitsRoute = require('./routes/habits');
const authRoute = require('./routes/auth');

const server = express();
server.use(cors());
server.use(express.json());
server.use('/users', usersRoute);
server.use('/habits', habitsRoute);
server.use('/auth', authRoute);

server.get('/', (req, res) => res.send('Hello client!'));

module.exports = server;