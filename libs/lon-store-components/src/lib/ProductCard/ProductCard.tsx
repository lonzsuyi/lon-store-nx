import dynamic from 'next/dynamic';
import type { ProductCardProps } from './ProductCard.types';

// Dynamically import server and client components
const ProductCardClient = dynamic(() => import('./ProductCard.client'));
const ProductCardServer = dynamic(() => import('./ ProductCard.server'));

/**
 * Wrapper component that automatically selects the correct version (server or client).
 */
export const ProductCard: React.FC<ProductCardProps> = (props) => {
  return props.variant === 'regular' ? (
    <ProductCardClient {...props} />
  ) : (
    <ProductCardServer {...props} />
  );
};

export default ProductCard;