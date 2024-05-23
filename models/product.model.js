const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    maxPrice: {
        type: String,
        required: true,
    },
    
    description: {
        type: [String], // Assuming description is an array of strings
        required: true,
    },
    images: {
        type: [String], // Assuming images is an array of strings (URLs?)
        required: true,
    },
    type: [{
        size: {
            type: String,
            required: true,
        },
        material: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
    }],
    category: {
        type: String,
        required: true,
    },
    productType: {
        type: String,
        required: false,
    },
    quantity:{
        type: Number,
        required: false,
        default : 0
    }
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
