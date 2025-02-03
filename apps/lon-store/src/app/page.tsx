import { getClient } from '../graphql/apolloClient';
import { GET_PRODUCTS, ProductsResponse } from '../graphql/gql/product';

import { ProductCardList } from '../components/client';

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

  return <ProductCardList products={products} />;
}
