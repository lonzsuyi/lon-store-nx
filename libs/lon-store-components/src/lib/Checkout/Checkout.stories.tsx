import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Dialog } from '../Dialog/Dialog';
import { Button } from '../Button/Button';
import { Checkout, CheckoutFormData } from './Checkout';

/**
 * Storybook metadata for the Checkout component.
 */
const meta: Meta<typeof Checkout> = {
  title: 'Layout/Checkout',
  component: Checkout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkout>;

/**
 * Mock Cart Data.
 */
const mockCartItems = [
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
 * Dialog Wrapper for Checkout.
 */
const CheckoutDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(mockCartItems);

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
        Proceed to Checkout
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Checkout">
        <Checkout
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveProduct={handleRemoveProduct}
          onCheckout={(formData: CheckoutFormData) => {
            console.log('Checkout Form Data:', formData);
            setIsOpen(false);
          }}
        />
      </Dialog>
    </>
  );
};

/**
 * Interactive Checkout Story.
 */
export const InteractiveCheckout: Story = {
  render: () => <CheckoutDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open Checkout Dialog
    const openCheckoutButton = canvas.getByText(/Proceed to Checkout/i);
    await userEvent.click(openCheckoutButton);

    // Ensure Checkout Dialog Appears
    await waitFor(() => {
      expect(canvas.getByText('Checkout')).toBeInTheDocument();
    });

    // Fill out Shipping Information
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Email/i }),
      'test@example.com'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: /^Name$/i }),
      'John Doe'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Address/i }),
      '123 Main St'
    );

    // Fill out Payment Information
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Card Number/i }),
      '4111111111111111'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Card Name/i }),
      'John Doe'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Expiry/i }),
      '12/25'
    );
    await userEvent.type(canvas.getByRole('textbox', { name: /CVC/i }), '123');

    // Remove Second Product
    const removeButtons = canvas.getAllByLabelText(/Remove product/i);
    await userEvent.click(removeButtons[1]);

    // Ensure Product 2 is Removed
    await waitFor(() => {
      expect(canvas.queryByText('Product 2')).toBeNull();
    });

    // Click Confirm Order
    const confirmOrderButton = canvas.getByText(/Confirm Order/i);
    await userEvent.click(confirmOrderButton);

    // Ensure Dialog Closes
    await waitFor(() => {
      expect(canvas.queryByText('Checkout')).toBeNull();
    });
  },
};
