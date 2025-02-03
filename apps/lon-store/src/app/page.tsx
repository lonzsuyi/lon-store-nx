import { GRAPHQL_ENDPOINT } from '../graphql/apolloClient';
import { GET_PRODUCTS_STRING, Product } from '../graphql/gql/product';

import { ProductCardList } from '../components/client';
import { ProductCardListProps } from '@lon-store-nx/lon-store-components';

const fetchProducts = async (): Promise<ProductCardListProps['products']> => {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_PRODUCTS_STRING,
    }),
    next: { revalidate: 60 }, // ISR，Data is reacquired every 60 seconds
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

  const { data } = await res.json();
  return data.products.map((product: Product) => ({
    id: String(product.id),
    imageSrc: product.image,
    title: product.title,
    price: product.price,
    rating: product.rating.rate,
  }));
};

export default async function Index() {
  const products = await fetchProducts();
  return <ProductCardList products={products} />;
}
