//imports
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const cors = require('cors'); // Import the cors middleware
const app = express(); 

//midllewares
app.use(express.json());
app.use(cors());
 
//api work
app.get('/',(req,res) => {
    res.send('hello world');
})
app.post('/api/products',async (req,res) =>{
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
})

app.get('/api/products',async (req,res) =>{
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
})

//database connection
mongoose.connect("mongodb+srv://figgleCanvas:VfcW0greBHWeRmBg@ecomm.xcwucfo.mongodb.net/Figgle-Api?retryWrites=true&w=majority&appName=Ecomm").then(()=>{console.log("connection success")}).catch(()=>{console.log("connection failed")});

//server
app.listen(3000,()=>{
    console.log('server is running on port 3000');
})