# Getting Started

To run the project:

```bash
npm install
npm start
```

# GraphQL Examples

## Mutations

<details>
<summary>Add a User</summary>

```graphql
mutation {
    addUser(username: "user_1", email: "user_1@ymail.com", role: CUSTOMER) {
        id
        email
    }
}
```
</details>

<details>
<summary>Add a Product</summary>

```graphql
mutation {
    addProduct(name: "KeyBoard", price: 99, category: "Electronics", status: ACTIVE) {
        name
    }
}
```
</details>

<details>
<summary>Add an Order (with products and user)</summary>

```graphql
mutation addOrder {
    addOrder(
        products: ["68b32bd1027824152f3917c2", "68b42f596f16ea08d53b5022"],
        user: "68b32b10027824152f3917c0",
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
```
</details>

---

## Queries

<details>
<summary>Fetch All Users' Emails</summary>

```graphql
query {
    users {
        email
    }
}
```
</details>

<details>
<summary>Fetch All Products with Details</summary>

```graphql
query {
    products {
        id
        name
        category
    }
}
```
</details>

<details>
<summary>Fetch Orders with Conditional Status and Fragments</summary>

```graphql
query($if: Boolean!) {
    orders {
        id
        status @include(if: $if)
        user {
            ...UserFields
        }
        products {
            name
            category
        }
    }
}

fragment UserFields on User {
    email
    username
}
```
</details>

---

## Subscriptions

<details>
<summary>Real-time Updates</summary>

```graphql
TODO
```
</details>

---

## Introspection

<details>
<summary>Fetch Schema Types</summary>

```graphql
{
    __schema {
        types {
            name
            kind
        }
    }
}
```
</details>


## TODOs

- [ ] Add test cases for mutations and queries
- [ ] Implement subscription examples
- [ ] Document error handling strategies
- [ ] Add authentication and authorization examples
- [ ] Provide sample responses for each operation