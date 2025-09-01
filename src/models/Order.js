// Order model definition using Mongoose

const mongoose = require('mongoose');

// Define the schema for an Order
const orderSchema = new mongoose.Schema({
    // Array of product references
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Reference to the user who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Total price of the order
    total: Number,
    // Status of the order
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'] 
    }
});

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);