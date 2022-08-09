const {cookieSessionName} = require('../constants');
const {secret} = require('../config/env');
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const token = req.cookies[cookieSessionName];

    if(token){
        jwt.verify(token, secret, ((err, decodedToken) => {
            if(err){
                res.clearCookie(cookieSessionName);
                return res.redirect('/');
            }

            req.user = decodedToken;
            res.locals.user = decodedToken;

            next();
        }));
    } else {
        next();
    }
};

exports.isAuth = (req, res, next) => {
    if(!req.user){
        return res.redirect('/auth/login');
    }

    next();
};

exports.isGuest = (req, res, next) => {
    if(req.user){
        return res.redirect('/');
    }

    next();
};