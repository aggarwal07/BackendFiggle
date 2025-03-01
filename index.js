//imports
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const Account = require("./models/account.model");
const Order = require("./models/order.model");
const cors = require("cors"); // Import the cors middleware
const Razorpay = require("razorpay");
const app = express();
const crypto = require("crypto");
require("dotenv").config();

//midllewares
app.use(express.json());
app.use(cors());

//api work
app.get("/", (req, res) => {
  res.send("Welcome To Figgle API");
});
//Products API
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/products/:productType", async (req, res) => {
  const productType = req.params.productType;
  const category = req.query.category; // get the genre from query parameters

  try {
    let query = { productType: productType };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const limit = parseInt(req.query.limit, 10) || 5;
    const products = await Product.find({
      name: new RegExp(searchTerm, "i"),
    }).limit(limit); // Case-insensitive search
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Account API
app.post("/api/accounts", async (req, res) => {
  try {
    const existingAccount = await Account.findOne({ email: req.body.email });
    if (!existingAccount) {
      const newAccount = await Account.create(req.body);
      res.status(201).json(newAccount);
    } else {
      res.status(400).json({ message: "Account already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/accounts/:email/:pass", async (req, res) => {
  const { email, pass } = req.params; // Using req.params to get parameters from URL
  try {
    const account = await Account.findOne({ email }); // Find account by email
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Compare the provided password with the password in the database
    if (pass !== account.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If email and password are correct, return the account
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accounts = await Account.findByIdAndUpdate(id, req.body);
    if (!accounts) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    const updatedAccount = await Account.findById(id);
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//orders API
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.find({ orderId: orderId });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/orders/payment", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      res.status(500).json({ message: "Error creating order" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/orders/payment/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
  sha.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = sha.digest("hex");
  if (digest === razorpay_signature) {
    res.status(200).json({
      message: "Payment successful",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } else {
    res.status(400).json({ message: "Payment failed" });
  }
});

//database connection
mongoose
  .connect(process.env.mongooseURI)
  .then(() => {
    console.log("connection success");
  })
  .catch(() => {
    console.log("connection failed");
  });

//server
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
