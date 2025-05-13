const jwt = require('jsonwebtoken');
const { jwtKey } = require('../configs/env');
const baseResponse = require("../utils/baseResponse");

function authenticator(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return baseResponse(res, false, 401, 'Unauthorized: No token provided', null);
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            return baseResponse(res, false, 401, 'Forbidden: Invalid or expired token', null);
        }
        req.user = user;
        next();
    });
}

module.exports = authenticator;