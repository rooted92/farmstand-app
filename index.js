const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


// Require the model we created in models/product.js
const Product = require('./models/product');
const Farm = require('./models/farm');

mongoose.connect('mongodb://127.0.0.1:27017/farmStandApp')
    .then(() => {
        console.log("Mongo Connection Open");
    }).catch(err => {
        console.log("Oh No Mongo Connection Error");
        console.log(err);
    });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// this tells express to parse the body of the request, and add it to the body property in the request object, in simple terms it allows us to access the data from the form in req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// This array is so we can loop over it and display the categories in the new product form by adding the selected attibute to the option tag
const categories = ['fruit', 'vegetable', 'dairy', 'fungi', 'baked goods'];

// Farm Routes

app.get('/farms', (req, res) => {
    res.send('Index of all farms');
});

app.get('/farms/new', (req, res) => {
    res.render('farms/new.ejs');
});

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect('/farms');
});

// Product Routes

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if(category){
        const foundProducts = await Product.find({ category })
        res.render('products/index.ejs', { foundProducts, category });
    } else {
        const foundProducts = await Product.find({});
        res.render('products/index.ejs', { foundProducts, category: 'All'});
    }
    // Remember that the second argument passed in to res.render is an object that contains all of the data we want to pass into the template
   
});

app.get('/products/new', (req, res) => {
    res.render('products/new.ejs', { categories});
});

app.get('/products/:id/edit', async (req, res) => {
    // Destructure the id from req.params
    const { id } = req.params;
    // Find the product in the database with the id
    const productToUpdate = await Product.findById(id);
    res.render('products/edit.ejs', { productToUpdate, categories });
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    // Find the product in the database with the id, and update it with the data from the form
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${updatedProduct._id}`);
});

app.post('/products', async (req, res) => {
    // Make the new product using the data from the form
    const newProduct = new Product(req.body);
    // Save the new product to the database
    await newProduct.save();
    // console.log(newProduct);
    // Redirect to the page for the new product, using the mongo id of the new product hence the underscore
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    // Destrucure the id of product from req.params
    const { id } = req.params;
    // Find the product in the database with the id
    const foundProduct = await Product.findById(id);
    // Render the show template with the foundProduct
    res.render('products/details.ejs', { foundProduct });
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    // Delete the product from the database
    await Product.findByIdAndDelete(id);// we are awaiting this so that we can redirect to the products page after the product is deleted
    res.redirect('/products');
})

app.listen('3000', () => {
  console.log('Server started on port 3000');
});