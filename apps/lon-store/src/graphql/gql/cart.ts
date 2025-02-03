import { gql } from '@apollo/client';
import { Product } from './product';

/**
 * GraphQL query to fetch a single cart by its ID.
 * Retrieves the cart ID, user ID, date, and the list of products in the cart.
 */
export const GET_CART = gql`
  query GetCart($id: ID!) {
    cart(id: $id) {
      id
      userId
      date
      products {
        productId
        quantity
        product {
          id
          title
          price
          description
          category
          image
          rating {
            rate
            count
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch all carts.
 */
export const GET_CARTS = gql`
  query GetCarts {
    carts {
      id
      userId
      date
      products {
        productId
        quantity
      }
    }
  }
`;

/**
 * GraphQL mutation to update an entire cart (PUT).
 * Requires cart ID, user ID, date, and an array of products.
 */
export const UPDATE_CART = gql`
  mutation UpdateCart(
    $id: ID!
    $userId: ID!
    $date: String!
    $products: [CartItemInput]!
  ) {
    updateCart(id: $id, userId: $userId, date: $date, products: $products) {
      id
      userId
      date
      products {
        productId
        quantity
      }
    }
  }
`;

/**
 * GraphQL mutation to partially update a cart (PATCH).
 * Allows updating any subset of cart fields.
 */
export const PARTIAL_UPDATE_CART = gql`
  mutation PartialUpdateCart(
    $id: ID!
    $userId: ID
    $date: String
    $products: [CartItemInput]
  ) {
    partialUpdateCart(
      id: $id
      userId: $userId
      date: $date
      products: $products
    ) {
      id
      userId
      date
      products {
        productId
        quantity
      }
    }
  }
`;

/**
 * GraphQL mutation to delete a cart (DELETE).
 */
export const DELETE_CART = gql`
  mutation DeleteCart($id: ID!) {
    deleteCart(id: $id) {
      id
      userId
      date
      products {
        productId
        quantity
      }
    }
  }
`;

/**
 * Represents an item in the cart, containing the product ID and quantity.
 */
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

/**
 * Represents a shopping cart, including the user ID, date, and the list of cart items.
 */
export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}

/**
 * Represents the response structure for the GET_CART query.
 */
export interface CartResponse {
  cart: Cart;
}

/**
 * Represents the response structure for the GET_CARTS query.
 */
export interface CartsResponse {
  carts: Cart[];
}

/**
 * Represents the input type for updating a cart.
 */
export interface UpdateCartInput {
  id: string;
  userId: number;
  date: string;
  products: CartItem[];
}

/**
 * Represents the input type for partially updating a cart.
 */
export interface PartialUpdateCartInput {
  id: string;
  userId?: number;
  date?: string;
  products?: CartItem[];
}

/**
 * Represents the response structure for the DELETE_CART mutation.
 */
export interface DeleteCartResponse {
  deleteCart: Cart;
}
