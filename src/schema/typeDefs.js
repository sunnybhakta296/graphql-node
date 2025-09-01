// GraphQL type definitions for the options service schema
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Enums
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

    # Product type
    type Product {
        id: ID!
        name: String!
        price: Int!
        category: String
        status: StatusEnum!
    }

    # Order type
    type Order {
        id: ID!
        products: [Product]
        user: User
        total: Int!
        status: OrderStatusEnum!
    }

    # User type
    type User {
        id: ID!
        username: String!
        email: String!
        role: RoleEnum!
    }

    # Queries
    type Query {
        product(id: ID!): Product
        products(onlyActive: Boolean): [Product!]!

        user(id: ID!): User
        users: [User!]!

        order(id: ID!): Order
        orders(userId: ID): [Order!]!

        _schema: String
    }

    # Mutations
    type Mutation {
        addProduct(
            name: String!, 
            price: Int!, 
            category: String, 
            status: StatusEnum
        ): Product

        updateProduct(
            id: ID!, 
            name: String, 
            price: Int, 
            category: String, 
            status: StatusEnum
        ): Product

        deleteProduct(id: ID!): Boolean

        addUser(
            username: String!, 
            email: String!, 
            role: RoleEnum!
        ): User

        updateUser(
            id: ID!, 
            username: String, 
            email: String, 
            role: RoleEnum
        ): User

        deleteUser(id: ID!): Boolean

        addOrder(
            products: [ID!]!, 
            user: ID!, 
            total: Int!, 
            status: OrderStatusEnum!
        ): Order

        updateOrder(
            id: ID!, 
            products: [ID!], 
            user: ID, 
            total: Int, 
            status: OrderStatusEnum
        ): Order

        deleteOrder(id: ID!): Boolean
    }

    # Subscriptions
    type Subscription {
        productAdded: Product
        productUpdated: Product
        productDeleted: ID

        userAdded: User
        userUpdated: User
        userDeleted: ID

        orderAdded: Order
        orderUpdated: Order
        orderDeleted: ID
    }
`;

module.exports = typeDefs;