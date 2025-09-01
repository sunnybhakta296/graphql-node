// Import required modules
const { app, server } = require("./src/server"); // Express app and Apollo Server
const mongoose = require("mongoose"); // MongoDB ODM

// Async function to initialize server and database connection
async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://localhost:27017/ecommerce");

        // Start Apollo GraphQL server
        await server.start();

        // Attach Apollo middleware to Express app
        server.applyMiddleware({ app });

        // Log server ready message with GraphQL endpoint
        console.log(
            `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
        );
    } catch (error) {
        // Log errors and exit process if startup fails
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
}

// Begin server initialization
startServer();

// Start Express app listening on port 4000
app.listen(4000, () => {
    console.log("Server running on port 4000");
});