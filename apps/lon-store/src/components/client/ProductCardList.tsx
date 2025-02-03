'use client';

import { useCart } from '../../hook/CartContext';

import {
  ProductCardList as CustProductCardList,
  ProductCardListProps,
} from '@lon-store-nx/lon-store-components';

export const ProductCardList: React.FC<ProductCardListProps> = ({
  products,
}) => {
  const { cart, updateCart } = useCart();

  // Add product to cart
  const addToCart = async (productId: string) => {
    if (!cart?.id) {
      console.error('Cart ID is missing, cannot update product quantity.');
      return;
    }
    const productIdNumber = parseInt(productId, 10);
    const quantity = 1;
    const updatedProducts = cart.products.map(
      (item) =>
        item.productId === productIdNumber
          ? { ...item, quantity } // Update quantity for this product
          : item // Keep other products unchanged
    );

    updateCart({
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: updatedProducts, // Send the full updated product list
    });
  };

  return <CustProductCardList products={products} onAddToCart={addToCart} />;
};

export default ProductCardList;
