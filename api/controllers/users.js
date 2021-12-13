async function show(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function update(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { show, update }