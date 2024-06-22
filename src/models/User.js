const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 5,
    required: [true, "Username is required!"],
  },
  email: {
    type: String,
    minLength: 10,
    required: [true, "Email is required!"],
  },

  password: {
    type: String,
    minLength: 4,
    required: [true, "Password is required!"],
  },

  createdPlans: [{
    type: mongoose.Types.ObjectId,
    ref: "Crypto",
  }],

});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
