/**
 * Props for the ProductCardList component.
 */
export interface ProductCardListProps {
  products: {
    id: string;
    imageSrc: string;
    title: string;
    price: number;
    rating?: number;
  }[];
  initialLoad?: number; // Initial number of products to load
  loadMore?: number; // Number of products to load per scroll
  onAddToCart?: (productId: string) => void;
}
