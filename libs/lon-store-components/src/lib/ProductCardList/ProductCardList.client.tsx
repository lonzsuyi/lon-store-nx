'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import type { ProductCardListProps } from './ProductCardList.types';

/**
 * `ProductCardList` component with infinite scroll (bottom-load pagination).
 */
export const ProductCardList: React.FC<ProductCardListProps> = ({
  products,
  initialLoad = 6,
  loadMore = 6,
  onAddToCart,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState(
    products.slice(0, initialLoad)
  );
  const [hasMore, setHasMore] = useState(products.length > initialLoad);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Function to load more products
  const loadMoreProducts = useCallback(() => {
    setDisplayedProducts((prev) => {
      const newProducts = products.slice(0, prev.length + loadMore);
      setHasMore(newProducts.length < products.length);
      return newProducts;
    });
  }, [products, loadMore]);

  // Use IntersectionObserver to detect bottom reach
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { rootMargin: '100px' }
    );

    // Store `loadMoreRef.current` inside the effect
    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loadMoreProducts]);

  return (
    <div className="flex flex-col gap-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            variant="regular"
            productId={product.id}
            imageSrc={product.imageSrc}
            title={product.title}
            price={product.price}
            rating={product.rating}
            onAddToCart={() => {
              onAddToCart?.(product.id || '');
            }}
          />
        ))}
      </div>

      {/* Load More Indicator */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-4"
        >
          <span className="text-gray-500">Loading more products...</span>
        </div>
      )}
    </div>
  );
};

export default ProductCardList;
