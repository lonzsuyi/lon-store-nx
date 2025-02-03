import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Button } from '../Button/Button';
import { Dialog } from '../Dialog/Dialog';
import { Cart, CartProps } from './Cart';

/**
 * Storybook metadata for the Cart component.
 */
const meta: Meta<typeof Cart> = {
  title: 'Layout/Cart',
  component: Cart,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Cart>;

/**
 * Mock cart items.
 */
const mockCartItems: CartProps['cartItems'] = [
  {
    id: '1',
    imageSrc: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    title: 'Product 1',
    price: 25.0,
    quantity: 1,
  },
  {
    id: '2',
    imageSrc: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    title: 'Product 2',
    price: 30.0,
    quantity: 2,
  },
];

/**
 * Interactive Storybook Cart Component.
 */
const InteractiveCartWrapper = () => {
  const [cartItems, setCartItems] =
    useState<CartProps['cartItems']>(mockCartItems);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Update item quantity.
   */
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  /**
   * Remove an item from the cart.
   */
  const handleRemoveProduct = (id: string) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);
      return [...updatedCart];
    });
  };

  return (
    <>
      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Open Cart Dialog
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cart">
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveProduct={handleRemoveProduct}
          onNextClick={() => console.log('Proceeding to checkout...')}
        />
      </Dialog>
    </>
  );
};

/**
 * Interactive Cart Story in a Dialog.
 */
export const InteractiveCartInDialog: Story = {
  render: () => <InteractiveCartWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open cart dialog
    const openCartButton = canvas.getByText(/Open Cart Dialog/i);
    await userEvent.click(openCartButton);

    // Ensure cart opens
    await waitFor(() => {
      expect(canvas.getByText('Cart')).toBeInTheDocument();
    });

    // Remove Product 2
    const removeButton = canvas.getAllByLabelText('Remove product')[1];
    await userEvent.click(removeButton);

    //  Ensure Product 2 is removed
    await waitFor(() => {
      expect(canvas.queryByText('Product 2')).toBeNull();
    });

    // Ensure Checkout Button is still visible
    await waitFor(() => {
      expect(canvas.getByText('Checkout')).toBeInTheDocument();
    });
  },
};
