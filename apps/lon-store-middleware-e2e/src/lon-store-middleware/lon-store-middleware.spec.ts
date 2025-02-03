import fetchMock from 'jest-fetch-mock';

describe('GraphQL API E2E Tests (Mocked)', () => {

  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mock before each test
  });

  it('should fetch all products', async () => {
    // Ensure only 2 products are returned
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          products: [
            { id: '1', title: 'Test Product 1', price: 10.99 },
            { id: '2', title: 'Test Product 2', price: 20.49 },
          ],
        },
      })
    );
  
    const query = {
      query: `
        query {
          products {
            id
            title
            price
          }
        }
      `,
    };
  
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
  
    const data = await response.json();
  
    console.log('Mocked Response:', data); // Debugging
  
    expect(response.status).toBe(200);
    expect(data.data.products.length).toBe(20); // Ensure only 2 products are expected
    expect(data.data.products[0]).toHaveProperty('id', '1');
  });

  it('should fetch a single product by ID', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          product: { id: '1', title: 'Test Product', price: 15.99 },
        },
      })
    );

    const query = {
      query: `
        query {
          product(id: "1") {
            id
            title
          }
        }
      `,
    };

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.product).toHaveProperty('id', '1');
  });

  it('should update a cart', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          updateCart: {
            id: '1',
            products: [{ productId: '1', quantity: 2 }],
          },
        },
      })
    );

    const mutation = {
      query: `
        mutation {
          updateCart(id: "1", userId: 1, date: "2025-01-01", products: [{ productId: 1, quantity: 2 }]) {
            id
            products {
              productId
              quantity
            }
          }
        }
      `,
    };

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.updateCart.products[0]).toMatchObject({
      productId: '1',
      quantity: 2,
    });
  });

  it('should delete a cart', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          deleteCart: { id: '1' },
        },
      })
    );

    const mutation = {
      query: `
        mutation {
          deleteCart(id: "1") {
            id
          }
        }
      `,
    };

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.deleteCart).toHaveProperty('id', '1');
  });
});