import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { Button } from '../Button/Button';

/**
 * Props for the CartContent component.
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
  nextBtnTxt?: string; //
  onNextClick: () => void; // Function to Next button click.
}

/**
 * `CartContent` displays the list of cart items and checkout button.
 */
export const Cart: React.FC<CartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveProduct,
  nextBtnTxt = 'Checkout',
  onNextClick,
}) => {
  return (
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
            onQuantityChange={(quantity) => onUpdateQuantity(item.id, quantity)}
          />
        ))
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <Button variant="green" onClick={onNextClick}>
          {nextBtnTxt}
        </Button>
      )}
    </div>
  );
};

export default Cart;
