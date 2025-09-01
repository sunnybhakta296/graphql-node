# Use Cases of GraphQL Schema Definitions

- **API Contract**: Define the structure and types of data available to clients.
- **Type Safety**: Enforce data types for queries and mutations, reducing runtime errors.
- **Documentation**: Serve as self-documenting source for available operations and data models.
- **Validation**: Enable automatic validation of incoming requests against the schema.
- **Introspection**: Allow clients to discover API capabilities dynamically.
- **Tooling Support**: Power code generation, IDE autocompletion, and API explorers.
- **Versioning**: Manage and evolve API features with clear schema changes.
- **Access Control**: Facilitate field-level authorization and permissions.

## Examples

### 1. API Contract
```graphql
type User {
    id: ID!
    name: String!
    email: String!
}
```
Defines the contract for a `User` object.

### 2. Type Safety
```graphql
type Query {
    getUser(id: ID!): User
}
```
Enforces that `id` must be provided and is of type `ID`.

### 3. Documentation
```graphql
"""
A user in the system
"""
type User {
    id: ID!
    name: String!
}
```
Descriptions provide built-in documentation.

### 4. Validation
```graphql
type Mutation {
    updateEmail(id: ID!, email: String!): User
}
```
Automatically validates required fields and types.

### 5. Introspection
Clients can query the schema:
```graphql
{
    __schema {
        types {
            name
            fields {
                name
            }
        }
    }
}
```

### 6. Tooling Support
Tools like Apollo Codegen use schema:
```bash
apollo client:codegen --target typescript
```

### 7. Versioning
```graphql
type UserV2 {
    id: ID!
    name: String!
    username: String!
}
```
New types or fields indicate version changes.

### 8. Access Control
```graphql
type User {
    id: ID!
    email: String! @auth(requires: ADMIN)
}
```
Directives can restrict access to fields.

## Key Concepts

### Schema
A GraphQL schema defines the types, queries, mutations, and relationships in your API. It acts as the blueprint for what data can be queried or modified.

```graphql
schema {
    query: Query
    mutation: Mutation
}
```

### Mutation
Mutations are operations that modify server-side data. They are defined in the schema and specify input types and return types.

```graphql
type Mutation {
    createUser(name: String!, email: String!): User
}
```

### Other Concepts

- **Resolvers**: Functions that implement the logic for fetching or modifying data for each field in the schema.
- **Directives**: Special annotations (e.g., `@deprecated`, `@auth`) that add metadata or behavior to schema fields.
- **Subscriptions**: Enable real-time updates by allowing clients to subscribe to specific events in the schema.
- **Scalars**: Primitive data types like `String`, `Int`, `Boolean`, and custom scalars (e.g., `DateTime`).
- **Enums**: Define a set of allowed values for a field.

```graphql
enum Role {
    ADMIN
    USER
    GUEST
}
```