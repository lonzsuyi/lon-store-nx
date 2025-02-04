'use client';

import React from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Picture } from '../Picture/Picture';
import { Rate } from '../Rate/Rate.client';
import { TextField } from '../TextField/TextField';
import type { ProductCardProps } from './ProductCard.types';

/**
 * `ProductCard` component to display product information.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  variant,
  imageSrc,
  title,
  price,
  currency = 'AUD',
  rating = 0,
  quantity = 1,
  onAddToCart,
  onRemove,
  onQuantityChange,
}) => {
  const price_formatted = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={`py-4 px-3 w-full ${
        variant === 'regular'
          ? 'min-h-[487px] flex flex-col justify-between'
          : 'h-[123px] flex items-center border-b border-b-gray-200'
      } bg-white`}
      data-testid="product-card"
    >
      {variant === 'regular' ? (
        // Regular Variant
        <>
          {/* Product Image */}
          <Picture
            src={imageSrc}
            alt={title}
            className="w-full h-[305px] object-cover rounded-md"
          />

          {/* Title: over 3 line clamp */}
          <h3 className="mt-2 text-sm font-medium text-gray-400 line-clamp-3"  data-testid="product-title">
            {title}
          </h3>

          {/* Price & Rating */}
          <div className="flex justify-between items-center mt-2 mb-2">
            <span  data-testid="product-price" className="text-lg font-medium text-black">
              {price_formatted.format(price)}
            </span>
            <Rate value={rating} size={18} />
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            variant="blue"
            onClick={() => {
              onAddToCart?.(productId || '');
            }}
            data-testid="add-to-cart"
          >
            Add to Cart
          </Button>
        </>
      ) : (
        // Mini Variant
        <>
          {/* Left: Product Image */}
          <Picture
            src={imageSrc}
            alt={title}
            className="w-[96px] h-[87px] px-2 object-cover rounded-md"
          />
          {/* Right: Product Info */}
          <div className="h-full flex-1 flex flex-col justify-between pl-2 py-1" data-testid="cart-item">
            <div className="flex justify-between items-center">
              {/* Title: over 3 line clamp */}
              <h3 className="text-sm font-medium text-gray-400 line-clamp-3" data-testid="cart-item-title">
                {title}
              </h3>

              {/* Remove Button */}
              <Icon
                className="text-gray-400 cursor-pointer"
                name="Trash2"
                size={20}
                aria-label="Remove product"
                onClick={onRemove}
                data-testid="remove-cart-item"
              />
            </div>

            <div className="flex justify-between items-center mt-1">
              {/* Price */}
              <span className="text-lg font-medium text-black">
                {price_formatted.format(price)}
              </span>

              {/* Quantity Selector */}
              <TextField
                fieldSize="sm"
                fieldType="number"
                className="w-[65px] text-center"
                hideenErrMsg={true}
                value={quantity}
                onChange={(e) =>
                  onQuantityChange?.(parseInt(e.target.value, 10) || 1)
                }
                data-testid="cart-item-quantity"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
