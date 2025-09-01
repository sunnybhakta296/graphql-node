// Import required models
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Import PubSub for GraphQL subscriptions
// TODO: Uncomment the following lines to enable GraphQL subscriptions
// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();

// GraphQL resolvers
const resolvers = {
    // Query resolvers
    Query: {
        // Fetch a single product by ID
        product: async (_, { id }) => {
            try {
                return await Product.findById(id);
            } catch (error) {
                throw new Error('Failed to fetch product: ' + error.message);
            }
        },
        // Fetch all products, optionally only active ones
        products: async (_, { onlyActive }) => {
            try {
                if (onlyActive) {
                    return await Product.find({ status: 'ACTIVE' });
                }
                return await Product.find();
            } catch (error) {
                throw new Error('Failed to fetch products: ' + error.message);
            }
        },
        // Fetch a single user by ID
        user: async (_, { id }) => {
            try {
                return await User.findById(id);
            } catch (error) {
                throw new Error('Failed to fetch user: ' + error.message);
            }
        },
        // Fetch all users
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                throw new Error('Failed to fetch users: ' + error.message);
            }
        },
        // Fetch a single order by ID
        order: async (_, { id }) => {
            try {
                return await Order.findById(id);
            } catch (error) {
                throw new Error('Failed to fetch order: ' + error.message);
            }
        },
        // Fetch all orders
        orders: async () => {
            try {
                const data = await Order.find();
                console.log('Fetched orders:', data);
                return data;
            } catch (error) {
                throw new Error('Failed to fetch orders: ' + error.message);
            }
        },
        // Introspection query
        __Schema: () => 'Introspection Enabled'
    },

    // Mutation resolvers
    Mutation: {
        // Add a new product
        addProduct: async (_, { name, price, category, status }) => {
            try {
                const product = await Product.create({ name, price, category, status });
                pubsub.publish('PRODUCT_ADDED', { productAdded: product });
                return product;
            } catch (error) {
                throw new Error('Failed to add product: ' + error.message);
            }
        },
        // Update an existing product
        updateProduct: async (_, { id, name, price, category, status }) => {
            try {
                const product = await Product.findByIdAndUpdate(id, { name, price, category, status }, { new: true });
                pubsub.publish('PRODUCT_UPDATED', { productUpdated: product });
                return product;
            } catch (error) {
                throw new Error('Failed to update product: ' + error.message);
            }
        },
        // Delete a product
        deleteProduct: async (_, { id }) => {
            try {
                await Product.findByIdAndDelete(id);
                pubsub.publish('PRODUCT_DELETED', { productDeleted: id });
                return true;
            } catch (error) {
                throw new Error('Failed to delete product: ' + error.message);
            }
        },
        // Add a new user
        addUser: async (_, { username, email, role }) => {
            try {
                console.log('Adding user:', { username, email, role });
                const user = await User.create({ username, email, role });
                pubsub.publish('USER_ADDED', { userAdded: user });
                return user;
            } catch (error) {
                throw new Error('Failed to add user: ' + error.message);
            }
        },
        // Update an existing user
        updateUser: async (_, { id, username, email, role }) => {
            try {
                const user = await User.findByIdAndUpdate(id, { username, email, role }, { new: true });
                pubsub.publish('USER_UPDATED', { userUpdated: user });
                return user;
            } catch (error) {
                throw new Error('Failed to update user: ' + error.message);
            }
        },
        // Delete a user
        deleteUser: async (_, { id }) => {
            try {
                await User.findByIdAndDelete(id);
                pubsub.publish('USER_DELETED', { userDeleted: id });
                return true;
            } catch (error) {
                throw new Error('Failed to delete user: ' + error.message);
            }
        },
        // Add a new order
        addOrder: async (_, { products, user, total, status }) => {
            try {
                const order = await Order.create({ products, user, total, status });
                pubsub.publish('ORDER_ADDED', { orderAdded: order });
                console.log('Published ORDER_ADDED');
                return order;
            } catch (error) {
                throw new Error('Failed to add order: ' + error.message);
            }
        },
        // Update an existing order
        updateOrder: async (_, { id, products, user, total, status }) => {
            try {
                const order = await Order.findByIdAndUpdate(id, { products, user, total, status }, { new: true });
                pubsub.publish('ORDER_UPDATED', { orderUpdated: order });
                return order;
            } catch (error) {
                throw new Error('Failed to update order: ' + error.message);
            }
        },
        // Delete an order
        deleteOrder: async (_, { id }) => {
            try {
                await Order.findByIdAndDelete(id);
                pubsub.publish('ORDER_DELETED', { orderDeleted: id });
                return true;
            } catch (error) {
                throw new Error('Failed to delete order: ' + error.message);
            }
        },
    },

    // TODO: GraphQL subscriptions
    /*
    Subscription: {
        productAdded: {
            subscribe: () => pubsub.asyncIterator(['PRODUCT_ADDED']),
        },
        productUpdated: {
            subscribe: () => pubsub.asyncIterator(['PRODUCT_UPDATED']),
        },
        productDeleted: {
            subscribe: () => pubsub.asyncIterator(['PRODUCT_DELETED']),
        },
        userAdded: {
            subscribe: () => pubsub.asyncIterator(['USER_ADDED']),
        },
        userUpdated: {
            subscribe: () => pubsub.asyncIterator(['USER_UPDATED']),
        },
        userDeleted: {
            subscribe: () => pubsub.asyncIterator(['USER_DELETED']),
        },
        orderAdded: {
            subscribe: () => {
                console.log('orderAdded subscription invoked');
                return pubsub.asyncIterator(['ORDER_ADDED']);
            },
        },
        orderUpdated: {
            subscribe: () => pubsub.asyncIterator(['ORDER_UPDATED']),
        },
        orderDeleted: {
            subscribe: () => pubsub.asyncIterator(['ORDER_DELETED']),
        },
    },
    */

    // Field resolvers for Order type
    Order: {
        // Resolve products for an order
        products: async (order) => {
            try {
                return Product.find({ _id: { $in: order.products } });
            } catch (error) {
                throw new Error('Failed to fetch products for order: ' + error.message);
            }
        },
        // Resolve user for an order
        user: async (order) => {
            try {
                const user = await User.findOne({ _id: order.user });
                console.log('Resolved user for order:', user, order.user);
                return user;
            } catch (error) {
                throw new Error('Failed to fetch user for order: ' + error.message);
            }
        },
    },
};

module.exports = resolvers;