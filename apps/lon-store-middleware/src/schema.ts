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
  products: { productId: number; quantity: number }[];
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

    console.log(`API Response from ${url}:`, JSON.stringify(data, null, 2)); // Log response

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
      return await fetchData<Cart>(`${API_URL}/carts/${id}`);
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

        // Ensure the response contains a token
        if (!data.token) {
          throw new Error('Invalid response: Missing token');
        }

        return { token: data.token }; // Ensure LoginResponse format
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
      }
    },
  },
};
