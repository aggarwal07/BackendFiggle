const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
  wishlist: { type: Array, default: [] },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
