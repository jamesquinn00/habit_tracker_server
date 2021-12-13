async function register(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function login(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { register, login}