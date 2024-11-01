const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: [String], // Array of strings for descriptions
        required: true,
    },
    images: {
        type: [String], // Array of image URLs
        required: true,
    },
    variants: [
        {
            material: {
                type: String,
                required: true,
            },
            options: [
                {
                    size: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    discountedPrice: {
                        type: String,
                        required: true,
                    },
                }
            ]
        }
    ],
    category: {
        type: String,
        required: true,
    },
    productType: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
        default: 1,
    }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
