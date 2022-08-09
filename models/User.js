const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config/env');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minlength: [5, 'The username should be at least 5 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minlength: [10, 'The username should be at least 10 characters long'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [4, 'The username should be at least 4 characters long'],
    },
});

userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds)
        .then(hashedPassword => {
            this.password = hashedPassword;

            next();
        });
});

const User = mongoose.model('User', userSchema);

module.exports = User;