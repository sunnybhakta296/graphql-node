const request = require('supertest');
const { app } = require('../src/server');

// Test suite for GraphQL product queries
describe('GraphQL Query Tests', () => {
    // Test: fetch all products
    it('should fetch all products', async () => {
        // GraphQL query to fetch all products
        const query = `
            query {
                products {
                    id
                    name
                    price
                }
            }
        `;

        // TODO: Send POST request to /graphql endpoint with the query
        // Example:
        // const response = await request(app)
        //     .post('/graphql')
        //     .send({ query });
        // expect(response.status).toBe(200);
        // expect(response.body.data.products).toBeDefined();
    });
});