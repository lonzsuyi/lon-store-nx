import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import type { ProductCardListProps } from './ProductCardList.types';

/**
 * Server-side (static) version of the ProductCardList component.
 */
export const ProductCardListServer: React.FC<ProductCardListProps> = ({
  products,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            variant="regular"
            imageSrc={product.imageSrc}
            title={product.title}
            price={product.price}
            rating={product.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCardListServer;