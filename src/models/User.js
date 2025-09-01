// User model definition using Mongoose

const mongoose = require('mongoose');

// Define the schema for User
const userSchema = new mongoose.Schema({
    username: String, // Username of the user
    email: String,    // Email address of the user
    role: {           // Role of the user, can be either 'ADMIN' or 'CUSTOMER'
        type: String,
        enum: ['ADMIN', 'CUSTOMER']
    }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);