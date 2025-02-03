import dynamic from 'next/dynamic';
import type { ProductCardListProps } from './ProductCardList.types';

// Dynamically import client and server components
const ProductCardListClient = dynamic(() => import('./ProductCardList.client'));
const ProductCardListServer = dynamic(() => import('./ProductCardList.server'));

/**
 * Wrapper component that automatically selects the correct version (server or client).
 */
export const ProductCardList: React.FC<ProductCardListProps> = (props) => {
  return props.initialLoad && props.loadMore ? (
    <ProductCardListClient {...props} />
  ) : (
    <ProductCardListServer {...props} />
  );
};

export default ProductCardList;