const request = require('supertest');
const app = require('../src/server'); 

// Test suite for Add Product Mutation
describe("Add Product Mutation", () => {
    it("should add a product with all fields", async () => {
        // GraphQL mutation to add a product
        const mutation = `
            mutation {
                addProduct(input: { name: "Mouse", price: 99, category: "Electronics", status: ACTIVE }) {
                    name
                    price
                    category
                    status
                }
            }
        `;
        // TODO: Send POST request to /graphql endpoint with the mutation

        // const response = await request(app)
        //     .post('/graphql')
        //     .send({ query: mutation });

        // expect(response.body.errors).toBeUndefined();
        // expect(response.body.data.addProduct).toBeDefined();
        // expect(response.body.data.addProduct).toHaveProperty('name', 'Mouse');
        // expect(response.body.data.addProduct).toHaveProperty('price', 99);
        // expect(response.body.data.addProduct).toHaveProperty('category', 'Electronics');
        // expect(response.body.data.addProduct).toHaveProperty('status', 'ACTIVE');
    });
});
