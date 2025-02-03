import { getClient } from '../graphql/apolloClient';
import { GET_PRODUCTS, ProductsResponse } from '../graphql/gql/product';
import { UPDATE_CART, GET_CART, CartResponse } from '../graphql/gql/cart';

import { ProductCardList } from '@lon-store-nx/lon-store-components';

export default async function Index() {
  const client = getClient();

  // Query products (Home list Requirements SEO SSR rendering is used here) SSR
  const { data } = await client.query<ProductsResponse>({
    query: GET_PRODUCTS,
  });
  const products = data.products.map((product) => {
    return {
      id: String(product.id),
      imageSrc: product.image,
      title: product.title,
      price: product.price,
      rating: product.rating.rate,
    };
  });

  // Fetch cart (SSR)
  const { data: cart } = await client.query<CartResponse>({
    query: GET_CART,
    variables: { id: '1' }, // Replace with dynamic cart ID if needed
  });

  // Add product to cart
  const addToCart = async (productId: string) => {
    await client.mutate({
      mutation: UPDATE_CART,
      variables: {
        id: cart.cart.id,
        userId: cart.cart.userId,
        date: cart.cart.date,
        products: cart.cart.products.push({
          productId: parseInt(productId, 10),
          quantity: 1,
        }),
      },
    });
  };

  return <ProductCardList products={products} onAddToCart={addToCart} />;
}
