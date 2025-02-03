import React from 'react';
import { Picture } from '../Picture/Picture';
import type { ProductCardProps } from './ProductCard.types';

/**
 * Non-interactive version of the ProductCard component for server-side rendering.
 */
export const ProductCardServer: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  price,
  currency = 'AUD',
  rating = 0,
}) => {
  const priceFormatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="py-4 px-3 w-full bg-white">
      {/* Product Image */}
      <Picture
        src={imageSrc}
        alt={title}
        className="w-full h-[305px] object-cover rounded-md"
      />

      {/* Product Title */}
      <h3 className="mt-2 text-sm font-medium text-gray-400 line-clamp-3">
        {title}
      </h3>

      {/* Price & Static Rating */}
      <div className="flex justify-between items-center mt-2 mb-2">
        <span className="text-lg font-medium text-black">
          {priceFormatted.format(price)}
        </span>
        <span className="text-sm text-gray-500">{rating} ★</span>
      </div>
    </div>
  );
};

export default ProductCardServer;