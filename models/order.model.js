const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    pinCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  cart: { type: Array, default: [] },
  paymentMethod: {
    type: String,
    required: false,
    enum: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderStatus: { type: String, required: false },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
