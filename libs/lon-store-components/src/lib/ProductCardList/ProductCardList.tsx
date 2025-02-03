'use client';

import ProductCardListClient from './ProductCardList.client';
import type { ProductCardListProps } from './ProductCardList.types';
/**
 * Wrapper component that automatically selects the correct version (server or client).
 */
export const ProductCardList: React.FC<ProductCardListProps> = (props) => {
  return <ProductCardListClient {...props} />;
};

export default ProductCardList;
