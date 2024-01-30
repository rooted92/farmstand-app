const mongoose = require('mongoose');
// Need to require mongoose in order to use it, since we will be using it to create a schema
// Also no need to connect to the database here, since we already did that in index.js and we will require this model in index.js

// We can create a schema for our products, this will be the blueprint for our products
// First build the schema, then compile it into a model

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        // We can add a min and max to the number, and also a message to display if the min/max is not met, this is an example of schema validation
        min: [0, "Price must be positive"],
        required: true
    },
    category: {
        type: String,
        lowercase: true,// This will make all categories lowercase
        enum: ['fruit', 'vegetable', 'dairy', 'fungi', 'baked goods']
    }
});

// Compile the Model

const Product = mongoose.model('Product', productSchema);

// Export the model

module.exports = Product;