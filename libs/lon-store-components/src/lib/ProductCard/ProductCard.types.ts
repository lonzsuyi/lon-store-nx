/**
 * Props for the ProductCard component.
 */
export interface ProductCardProps {
  /**
   * The type of product card.
   * - `"regular"`: Full display card with rating and "Add to Cart" button.
   * - `"mini"`: Compact display with a "Remove" button and quantity selector.
   */
  variant: 'regular' | 'mini';
  imageSrc: string; // Product image URL.
  productId: string;
  title: string;
  price: number;
  currency?: 'AUD';
  rating?: number; // Product rating (0-5).
  quantity?: number;
  onAddToCart?: (productId: string) => void; // Callback when "Add to Cart" is clicked (regular variant).
  onRemove?: () => void; // Callback when "Remove" is clicked (mini variant).
  onQuantityChange?: (value: number) => void; // Callback when quantity is changed (mini variant).
}
