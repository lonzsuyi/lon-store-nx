import fetch from 'node-fetch';

// API Base URL
const API_URL = 'https://fakestoreapi.com';

// GraphQL Schema Definitions
export const typeDefs = `
  type Product {
    id: ID!
    title: String!
    price: Float!
    description: String!
    category: String!
    image: String!
    rating: Rating
  }

  type Rating {
    rate: Float!
    count: Int!
  }

  type Cart {
    id: ID!
    userId: ID!
    date: String!
    products: [CartItem]!
  }

  type CartItem {
    productId: ID!
    quantity: Int!
    product: Product
  }

  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
    name: Name
    address: Address
    phone: String!
  }

  type Name {
    firstname: String!
    lastname: String!
  }

  type Address {
    city: String!
    street: String!
    number: Int!
    zipcode: String!
  }

  type AuthResponse {
    token: String!
  }

  type Query {
    products: [Product]!
    product(id: ID!): Product
    carts: [Cart]!
    cart(id: ID!): Cart
    users: [User]!
    user(id: ID!): User
  }

  type Mutation {
    login(username: String!, password: String!): AuthResponse
    updateCart(id: ID!, userId: ID!, date: String!, products: [CartItemInput]!): Cart
    partialUpdateCart(id: ID!, userId: ID, date: String, products: [CartItemInput]): Cart
    deleteCart(id: ID!): Cart
  }

  input CartItemInput {
    productId: ID!
    quantity: Int!
  }
`;

// TypeScript Interfaces for API Responses
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface Cart {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number; product: Product }[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
}

interface LoginResponse {
  token: string;
}

// Function to Fetch API Data with Error Handling
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`API Response from ${url}:`, JSON.stringify(data, null, 2)); // Debugging log

    // Ensure data is a valid object and matches the expected type
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid response from ${url}`);
    }

    return data as T;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw new Error(`Failed to fetch data from ${url}`);
  }
}

// GraphQL Resolvers
export const resolvers = {
  Query: {
    products: async (): Promise<Product[]> => {
      return await fetchData<Product[]>(`${API_URL}/products`);
    },
    product: async (_: unknown, { id }: { id: string }): Promise<Product> => {
      return await fetchData<Product>(`${API_URL}/products/${id}`);
    },
    carts: async (): Promise<Cart[]> => {
      return await fetchData<Cart[]>(`${API_URL}/carts`);
    },
    cart: async (_: unknown, { id }: { id: string }): Promise<Cart> => {
      // Fetch cart data from API
      const cart = await fetchData<Cart>(`${API_URL}/carts/${id}`);

      // Fetch full product details for each productId in the cart
      const enrichedProducts = await Promise.all(
        cart.products.map(async (item) => {
          const product = await fetchData<Product>(
            `${API_URL}/products/${item.productId}`
          );
          return { ...item, product }; // Add full product details to the item
        })
      );

      return { ...cart, products: enrichedProducts };
    },
    users: async (): Promise<User[]> => {
      return await fetchData<User[]>(`${API_URL}/users`);
    },
    user: async (_: unknown, { id }: { id: string }): Promise<User> => {
      return await fetchData<User>(`${API_URL}/users/${id}`);
    },
  },

  Mutation: {
    login: async (
      _: unknown,
      { username, password }: { username: string; password: string }
    ): Promise<LoginResponse> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error(`Login failed! Status: ${response.status}`);
        }

        const data = (await response.json()) as Partial<LoginResponse>;

        if (!data.token) {
          throw new Error('Invalid response: Missing token');
        }

        return { token: data.token };
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
      }
    },

    // Update (PUT) an entire cart
    updateCart: async (
      _: unknown,
      {
        id,
        userId,
        date,
        products,
      }: { id: string; userId: number; date: string; products: CartItem[] }
    ): Promise<Cart> => {
      try {
        const response = await fetch(`${API_URL}/carts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date, products }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update cart! Status: ${response.status}`);
        }

        const data = (await response.json()) as Cart; // Explicitly cast as Cart

        if (
          !data.id ||
          !data.userId ||
          !data.date ||
          !Array.isArray(data.products)
        ) {
          throw new Error('Invalid cart response');
        }

        return data;
      } catch (error) {
        console.error('Update Cart Failed:', error);
        throw new Error('Failed to update cart');
      }
    },

    // Partially Update (PATCH) a cart
    partialUpdateCart: async (
      _: unknown,
      {
        id,
        userId,
        date,
        products,
      }: { id: string; userId?: number; date?: string; products?: CartItem[] }
    ): Promise<Cart> => {
      try {
        const response = await fetch(`${API_URL}/carts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date, products }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to partially update cart! Status: ${response.status}`
          );
        }

        const data = (await response.json()) as Cart; // Explicitly cast as Cart

        if (
          !data.id ||
          !data.userId ||
          !data.date ||
          !Array.isArray(data.products)
        ) {
          throw new Error('Invalid cart response');
        }

        return data;
      } catch (error) {
        console.error('Partial Update Cart Failed:', error);
        throw new Error('Failed to partially update cart');
      }
    },

    // Delete a cart
    deleteCart: async (_: unknown, { id }: { id: string }): Promise<Cart> => {
      try {
        const response = await fetch(`${API_URL}/carts/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete cart! Status: ${response.status}`);
        }

        const data = (await response.json()) as Cart; // Explicitly cast as Cart

        if (
          !data.id ||
          !data.userId ||
          !data.date ||
          !Array.isArray(data.products)
        ) {
          throw new Error('Invalid cart response');
        }

        return data;
      } catch (error) {
        console.error('Delete Cart Failed:', error);
        throw new Error('Failed to delete cart');
      }
    },
  },
};
