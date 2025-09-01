# GraphQL Concepts Example with Node.js, Express, Mongoose, and Apollo Server (Product, Order, User)

This example demonstrates key GraphQL concepts—schema, types, queries, mutations, resolvers, fields, arguments, introspection, strong typing, nested queries, fragments, directives, subscriptions, scalars, enums, and versioning—using Node.js, Express, Mongoose, and Apollo Server, with Product, Order, and User models.

## 1. Setup

```bash
npm install express mongoose apollo-server-express graphql
```

## 2. Mongoose Models

```js
// models/Product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'] }
});
module.exports = mongoose.model('Product', productSchema);

// models/User.js
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: { type: String, enum: ['ADMIN', 'CUSTOMER'] }
});
module.exports = mongoose.model('User', userSchema);

// models/Order.js
const orderSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total: Number,
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'] }
});
module.exports = mongoose.model('Order', orderSchema);
```

## 3. GraphQL Schema (TypeDefs & Resolvers)

```js
// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum StatusEnum {
        ACTIVE
        INACTIVE
    }
    enum OrderStatusEnum {
        PENDING
        COMPLETED
        CANCELLED
    }
    enum RoleEnum {
        ADMIN
        CUSTOMER
    }

    type Product {
        id: ID!
        name: String!
        price: Int!
        category: String
        status: StatusEnum
    }

    type User {
        id: ID!
        username: String!
        email: String!
        role: RoleEnum!
    }

    type Order {
        id: ID!
        products: [Product!]!
        user: User!
        total: Int!
        status: OrderStatusEnum!
    }

    type Query {
        product(id: ID!): Product
        products(onlyActive: Boolean): [Product!]!
        user(id: ID!): User
        users: [User!]!
        order(id: ID!): Order
        orders(userId: ID): [Order!]!
        _schema: String
    }

    type Mutation {
        addProduct(name: String!, price: Int!, category: String, status: StatusEnum): Product
        updateProduct(id: ID!, name: String, price: Int, category: String, status: StatusEnum): Product
        deleteProduct(id: ID!): Boolean

        addUser(username: String!, email: String!, role: RoleEnum!): User
        updateUser(id: ID!, username: String, email: String, role: RoleEnum): User
        deleteUser(id: ID!): Boolean

        addOrder(products: [ID!]!, user: ID!, total: Int!, status: OrderStatusEnum!): Order
        updateOrder(id: ID!, products: [ID!], user: ID, total: Int, status: OrderStatusEnum): Order
        deleteOrder(id: ID!): Boolean
    }

    type Subscription {
        productAdded: Product
        orderAdded: Order
        userAdded: User
    }
`;

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
    Query: {
        product: (_, { id }) => Product.findById(id),
        products: async (_, { onlyActive }) => {
            const filter = onlyActive ? { status: 'ACTIVE' } : {};
            return Product.find(filter);
        },
        user: (_, { id }) => User.findById(id),
        users: () => User.find(),
        order: (_, { id }) => Order.findById(id).populate('products user'),
        orders: (_, { userId }) => {
            const filter = userId ? { user: userId } : {};
            return Order.find(filter).populate('products user');
        },
        _schema: () => 'Introspection enabled'
    },
    Mutation: {
        addProduct: async (_, args) => {
            const product = new Product(args);
            const saved = await product.save();
            pubsub.publish('PRODUCT_ADDED', { productAdded: saved });
            return saved;
        },
        updateProduct: async (_, { id, ...updates }) => Product.findByIdAndUpdate(id, updates, { new: true }),
        deleteProduct: async (_, { id }) => { await Product.findByIdAndDelete(id); return true; },

        addUser: async (_, args) => {
            const user = new User(args);
            const saved = await user.save();
            pubsub.publish('USER_ADDED', { userAdded: saved });
            return saved;
        },
        updateUser: async (_, { id, ...updates }) => User.findByIdAndUpdate(id, updates, { new: true }),
        deleteUser: async (_, { id }) => { await User.findByIdAndDelete(id); return true; },

        addOrder: async (_, args) => {
            const order = new Order(args);
            const saved = await order.save();
            pubsub.publish('ORDER_ADDED', { orderAdded: saved });
            return saved.populate('products user');
        },
        updateOrder: async (_, { id, ...updates }) => Order.findByIdAndUpdate(id, updates, { new: true }).populate('products user'),
        deleteOrder: async (_, { id }) => { await Order.findByIdAndDelete(id); return true; }
    },
    Subscription: {
        productAdded: { subscribe: () => pubsub.asyncIterator(['PRODUCT_ADDED']) },
        orderAdded: { subscribe: () => pubsub.asyncIterator(['ORDER_ADDED']) },
        userAdded: { subscribe: () => pubsub.asyncIterator(['USER_ADDED']) }
    },
    Order: {
        products: (order) => Product.find({ _id: { $in: order.products } }),
        user: (order) => User.findById(order.user)
    }
};

module.exports = { typeDefs, resolvers };
```

## 4. Express & Apollo Server Setup

```js
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

mongoose.connect('mongodb://localhost/graphql-demo');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer();

app.listen(4000, () => console.log('Server running on port 4000'));
```

## 5. Example Query (Nested, Fragments, Directives)

```graphql
mutation addOrder {
    addOrder(
        products: ["PRODUCT_ID_1", "PRODUCT_ID_2"],
        user: "USER_ID_1",
        total: 200,
        status: COMPLETED
    ) {
        id
        total
        status
        user {
            id
            username
        }
        products {
            id
            name
            price
        }
    }
}

query getOrders($userId: ID) {
    orders(userId: $userId) {
        ...OrderFields
        status @include(if: true)
        user {
            ...UserFields
        }
        products {
            ...ProductFields
        }
    }
}

fragment OrderFields on Order {
    id
    total
    status
}

fragment UserFields on User {
    id
    username
    email
    role
}

fragment ProductFields on Product {
    id
    name
    price
    category
    status
}
```

## 6. Subscription Example

```graphql
subscription {
    productAdded {
        id
        name
        price
        category
        status
    }
    orderAdded {
        id
        total
        status
        user { id username }
        products { id name }
    }
    userAdded {
        id
        username
        email
        role
    }
}
```

## 7. Versioning

You can version your schema by exposing different endpoints (e.g., `/graphql/v1`, `/graphql/v2`) or using custom directives to mark deprecated fields/types.

---

**Concepts Used:**  
- **Schema:** Defines API structure (types, queries, mutations, subscriptions).
- **Type:** Objects with specific fields (Product, Order, User).
- **Query:** Fetch data.
- **Mutation:** Modify data (create, update, delete).
- **Resolver:** Functions for fetching/modifying data.
- **Field:** Data units in types.
- **Arguments:** Parameters for queries/mutations.
- **Introspection:** Query schema metadata.
- **Strong Typing:** Predictable results via types.
- **Nested Queries:** Fetch related data.
- **Fragments:** Reusable query parts.
- **Directives:** Instructions for execution (`@include`).
- **Subscriptions:** Real-time updates.
- **Scalars:** Primitive types (String, Int, ID).
- **Enums:** Restricted values (`StatusEnum`, `OrderStatusEnum`, `RoleEnum`).
- **Versioning:** Multiple schema versions.