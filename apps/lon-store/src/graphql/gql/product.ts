import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch all available products.
 * It retrieves product details including ID, title, price, description, category, image, and rating.
 */
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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
`;
/**
 * GraphQL query to fetch all available products.
 * It retrieves product details including ID, title, price, description, category, image, and rating.
 */
export const GET_PRODUCTS_STRING = `
  query GetProducts {
    products {
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
`;

/**
 * Represents the rating of a product, including the rating score and number of reviews.
 */
export interface Rating {
  rate: number;
  count: number;
}

/**
 * Represents a product in the store, including all relevant details.
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating; // Ensure the product includes a rating
}

/**
 * Represents the response structure for the GET_PRODUCTS query.
 */
export interface ProductsResponse {
  products: Product[];
}
