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

app.get('/hello', (req, res) => {
    res.send('Hello World');
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});