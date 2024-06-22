const Crypto = require("../models/Crypto");
const User = require("../models/User");

exports.getAll = () => Crypto.find();
exports.getOne = (cryptoId) => Crypto.findById(cryptoId).populate();

exports.getOneDetailed = async (cryptoId, userId) => {
    const crypto = await Crypto.findById(cryptoId)
    .populate("owner")
    .populate("buyers")
    .lean();
 
    const isBuy = crypto.buyers.some(client => client._id.equals(userId));
    
    return { ...crypto, isBuy };
 }


exports.create = async (userId, cryptoData) => {
   const createdCrypto = await Crypto.create({
    owner: userId,
    ...cryptoData,
   });

   await User.findByIdAndUpdate(userId, { $push: { createdPlans: createdCrypto._id}});

   return createdCrypto;
};

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);
exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true});