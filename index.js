const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Require the model we created in models/product.js
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/farmStandApp')
    .then(() => {
        console.log("Mongo Connection Open");
    }).catch(err => {
        console.log("Oh No Mongo Connection Error");
        console.log(err);
    });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req, res) => {
    const foundProducts = await Product.find({});
    console.log(foundProducts);
    // Remember that the second argument passed in to res.render is an object that contains all of the data we want to pass into the template
    res.render('products/index.ejs', { foundProducts });
});

app.get('/products/:id', async (req, res) => {
    // Destrucure the id of product from req.params
    const { id } = req.params;
    // Find the product in the database with the id
    const foundProduct = await Product.findById(id);
    // Render the show template with the foundProduct
    res.render('products/details.ejs', { foundProduct });
})

app.listen('3000', () => {
  console.log('Server started on port 3000');
});