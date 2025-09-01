// Product model definition using Mongoose

const mongoose = require('mongoose');

// Define the schema for Product
const productSchema = new mongoose.Schema({
    name: String, // Name of the product
    price: Number, // Price of the product
    category: String, // Category of the product
    status: { 
        type: String, 
        enum: ['ACTIVE', 'INACTIVE'] // Product status can be either ACTIVE or INACTIVE
    }
});

// Export the Product model
module.exports = mongoose.model('Product', productSchema);