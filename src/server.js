// Import required modules
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

// Initialize Express app
const app = express();

// Create Apollo Server instance with schema and resolvers
const server = new ApolloServer({
    typeDefs,           // GraphQL type definitions
    resolvers,          // GraphQL resolvers
    introspection: true, // Enable introspection for GraphQL playground
    playground: true,    // Enable GraphQL playground
});

// Export server and app for external usage
module.exports = { app, server };
