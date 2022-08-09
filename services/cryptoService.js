const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find();
exports.getOne = (cryptoId) => Crypto.findById(cryptoId);
exports.getOneDetailed = (cryptoId) => Crypto.findById(cryptoId).populate('owner');
exports.update = (cryptoId, cryptoData) => Crypto.updateOne({_id: cryptoId}, {$set: cryptoData}, {runValidators: true});
exports.delete = (cryptoId) => Crypto.deleteOne({_id: cryptoId});
exports.create = (cryptoData) => Crypto.create(cryptoData);
exports.getMatches = (searchParam, paymentParam) => Crypto.find({ name: { $regex: new RegExp(searchParam, 'i') }, paymentMethod: { $regex: new RegExp(paymentParam, 'i') } });