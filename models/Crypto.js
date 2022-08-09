const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: [2, 'The name should be at least 2 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required!'],
        validate: /^https?:\/\/(.+)/,
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        min: 1
    },
    description: {
        type: String,
        required: [true, 'Destination is required!'],
        minlength: [10, 'The Property Description should be a minimum of 10 characters long']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required!'],
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal']
    },
    buyACrypto: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;