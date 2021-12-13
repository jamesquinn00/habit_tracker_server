const User = require('../models/user')

async function show(req, res) {
    try {
        const user = await User.findByEmail(req.params.email)
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send({err});
    }
}

async function update(req, res) {
    try {
        const user = await User.update(req.body)
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { show, update }