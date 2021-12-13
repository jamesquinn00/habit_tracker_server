const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // check for null token
    if (token == null) return res.sendStatus(401).json({ err: 'Null token' });
    // verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({ err: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = {
    verifyToken
}