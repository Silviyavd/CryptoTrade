const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/env');

exports.create = (userData) => User.create(userData);

exports.login = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw {message: 'Cannot find username or password!'}
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid){
        throw {message: 'Cannot find username or password!'}
    }

    return user;
};

exports.createToken = (user) => {
    const payload = {_id: user._id, email: user.email };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {expiresIn: '2d'}, (err, decodedToken) => {
            if(err){
                return reject(err);
            }

            resolve(decodedToken);
        });
    });
};