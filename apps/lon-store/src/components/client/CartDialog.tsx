'use client';

import { useCart } from '../../hook/cartContext';
import { Cart, CartProps, Dialog } from '@lon-store-nx/lon-store-components';

export const CartDialog: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateCart } = useCart();

  console.log(cart);

  const cartItems: CartProps['cartItems'] = (cart?.products ?? []).map(
    (product) => {
      return {
        id: product.productId.toString(),
        imageSrc: product.product.image,
        title: product.product.title,
        price: product.product.price,
        quantity: product.quantity,
      };
    }
  );

  /**
   * Update item quantity.
   */
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (!cart?.id) {
      console.error('Cart ID is missing, cannot update product quantity.');
      return;
    }

    const productIdNumber = parseInt(productId, 10);

    // Ensure the product ID is valid and quantity is non-negative
    if (!productIdNumber || quantity < 0) {
      console.error('Invalid product ID or quantity.');
      return;
    }

    // Generate a new product list with the updated quantity
    const updatedProducts = cart.products.map(
      (item) =>
        item.productId === productIdNumber
          ? { ...item, quantity } // Update quantity for this product
          : item // Keep other products unchanged
    );

    console.log('Updating cart with new quantity:', {
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: updatedProducts,
    });

    updateCart({
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: updatedProducts, // Send the full updated product list
    });
  };

  /**
   * Remove an item from the cart.
   */
  const handleRemoveProduct = (productId: string) => {
    if (!cart?.id) {
      console.error('Cart ID is missing, cannot remove product.');
      return;
    }

    const productIdNumber = parseInt(productId, 10);

    // Filter out the removed product from the cart
    const updatedProducts = cart.products.filter(
      (item) => item.productId !== productIdNumber
    );

    console.log('Updating cart after product removal:', {
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: updatedProducts,
    });

    updateCart({
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      products: updatedProducts, // Send updated product list (without the removed item)
    });
  };

  return (
    <Dialog isOpen={isCartOpen} onClose={closeCart} position="top" title="Cart">
      <Cart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveProduct={handleRemoveProduct}
        onNextClick={() => console.log('Proceeding to checkout...')}
      />
    </Dialog>
  );
};

export default CartDialog;
