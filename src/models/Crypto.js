const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        required: [true, "Name is required!"],
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: [true, "Image is required!"],
    },
    price: {
        type: Number,
        min: 0,
        required: [true, "Number is required!"],
    },
    description: {
        type: String,
        minLength: 10,
        required: [true, "Description is required!"],
    },
    payment: {
        type: String,
        enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
        required: [true, "Payment is required!"],
    },

    buyers: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

const Crypto = mongoose.model("Crypto", cryptoSchema);
module.exports = Crypto;
