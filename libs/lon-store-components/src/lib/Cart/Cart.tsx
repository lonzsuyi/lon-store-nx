import React, { useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { ProductCard } from '../ProductCard/ProductCard';
import { Button } from '../Button/Button';

/**
 * Props for the Cart component.
 */
export interface CartProps {
  cartItems: {
    // List of cart products.
    id: string;
    imageSrc: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  onUpdateQuantity: (id: string, quantity: number) => void; // Function to update product quantity.
  onRemoveProduct: (id: string) => void; // Function to remove a product.
  onCheckout: () => void; // Function to Checkout.
}

/**
 * `Cart` component to display shopping cart items inside a dialog.
 */
export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveProduct,
  onCheckout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Open Cart Button */}
      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Open Cart ({cartItems.length})
      </Button>

      {/* Shopping Cart Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cart"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <ProductCard
                key={item.id}
                variant="mini"
                imageSrc={item.imageSrc}
                title={item.title}
                price={item.price}
                onRemove={() => onRemoveProduct(item.id)}
                quantity={item.quantity}
                onQuantityChange={(quantity) =>
                  onUpdateQuantity(item.id, quantity)
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          )}

          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <Button variant="green" onClick={onCheckout}>
              Checkout
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Cart;
