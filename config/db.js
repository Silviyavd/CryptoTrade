const mongoose = require('mongoose');

const { dbQuery } = require('./env');

exports.dbInit = () => {
    mongoose.connection.on('open', () => console.log('DB is connected'));

    return mongoose.connect(dbQuery);
};