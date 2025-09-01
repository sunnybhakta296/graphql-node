# Real Case Example: Product and Order with GraphQL, Node.js, and MongoDB

## About GraphQL

GraphQL is a query language for APIs and a runtime for executing those queries by describing your data's shape. Unlike REST, GraphQL allows clients to request exactly the data they need, making it efficient and flexible for modern applications. It supports strong typing, real-time updates, and easy aggregation of data from multiple sources.

## Key Concepts and Terms in GraphQL

- **Schema**: Defines the structure of the API, including types, queries, and mutations.
- **Type**: Represents an object with specific fields (e.g., `Product`, `Order`).
- **Query**: Used to fetch data from the server.
- **Mutation**: Used to modify server-side data (create, update, delete).
- **Resolver**: Functions that handle fetching or modifying data for each field in the schema.
- **Field**: A unit of data you can query or mutate within a type.
- **Arguments**: Parameters passed to queries or mutations to filter or modify results.
- **Introspection**: The ability to query the schema itself for metadata.
- **Strong Typing**: Every field and argument has a specific type, ensuring predictable results.
- **Nested Queries**: Allows fetching related data in a single request.
- **Fragments**: Reusable units for query structures.
- **Directives**: Special instructions for query execution (e.g., `@include`, `@skip`).
- **Subscriptions**: Enables real-time updates via events.

These concepts help make GraphQL flexible, efficient, and developer-friendly for building APIs.

## GraphQL Key Concepts: Practical Examples

Below are practical examples for each key concept and term:

- **Schema**  
  ```graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
  }
  ```

- **Type**  
  `Product` and `Order` are types in the schema.

- **Query**  
  ```graphql
  query {
    products {
      name
      price
    }
  }
  ```

- **Mutation**  
  ```graphql
  mutation {
    addProduct(name: "Phone", price: 699.99, inStock: true) {
      id
      name
    }
  }
  ```

- **Resolver**  
  ```js
  Query: {
    products: async () => await Product.find(),
  }
  ```

- **Field**  
  In `Product`, `name`, `price`, and `inStock` are fields.

- **Arguments**  
  ```graphql
  query {
    products(inStock: true) {
      name
    }
  }
  ```

- **Introspection**  
  ```graphql
  {
    __schema {
      types {
        name
      }
    }
  }
  ```

- **Strong Typing**  
  `price: Float!` ensures `price` is always a float.

- **Nested Queries**  
  ```graphql
  query {
    orders {
      product {
        name
        price
      }
      quantity
    }
  }
  ```

- **Fragments**  
  ```graphql
  fragment productFields on Product {
    name
    price
  }
  query {
    products {
      ...productFields
    }
  }
  ```

- **Directives**  
  ```graphql
  query {
    products {
      name
      price @include(if: true)
    }
  }
  ```

- **Subscriptions**  
  ```graphql
  subscription {
    productAdded {
      id
      name
    }
  }
  ```


## Example

## 1. Product and Order Models

**src/models/productModel.js**
```js
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean,
});
module.exports = mongoose.model('Product', ProductSchema);
```

**src/models/orderModel.js**
```js
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', OrderSchema);
```

---

## 2. Update GraphQL Schema

**src/schema/typeDefs.js**
```js
const { gql } = require('apollo-server');
const typeDefs = gql`
  type Product {
    id: ID!
    name: String
    price: Float
    inStock: Boolean
  }
  type Order {
    id: ID!
    product: Product
    quantity: Int
    orderDate: String
  }
  type Query {
    products: [Product]
    orders: [Order]
  }
  type Mutation {
    addProduct(name: String!, price: Float!, inStock: Boolean!): Product
    addOrder(productId: ID!, quantity: Int!): Order
  }
`;
module.exports = typeDefs;
```

---

## 3. Update Resolvers

**src/schema/resolvers.js**
```js
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const resolvers = {
  Query: {
    products: async () => await Product.find(),
    orders: async () => await Order.find().populate('product'),
  },
  Mutation: {
    addProduct: async (_, { name, price, inStock }) => {
      const product = new Product({ name, price, inStock });
      await product.save();
      return product;
    },
    addOrder: async (_, { productId, quantity }) => {
      const order = new Order({ product: productId, quantity });
      await order.save();
      return await order.populate('product');
    },
  },
};
module.exports = resolvers;
```

---

## 4. Example Queries

- **Add a product:**
```graphql
mutation {
  addProduct(name: "Laptop", price: 1200.99, inStock: true) {
    id
    name
    price
    inStock
  }
}
```

- **Add an order:**
```graphql
mutation {
  addOrder(productId: "PRODUCT_ID_HERE", quantity: 2) {
    id
    product {
      name
      price
    }
    quantity
    orderDate
  }
}
```

- **Get all orders:**
```graphql
query {
  orders {
    id
    product {
      name
      price
    }
    quantity
    orderDate
  }
}
```
