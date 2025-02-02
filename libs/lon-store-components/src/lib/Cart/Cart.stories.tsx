import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
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
 * Default Cart with items.
 */
export const Default: Story = {
  args: {
    cartItems: mockCartItems,
    onUpdateQuantity: (id, quantity) =>
      console.log(`Update ${id} to ${quantity}`),
    onRemoveProduct: (id) => console.log(`Removed ${id}`),
    onCheckout: () => console.log('Checkout'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open cart dialog
    const openCartButton = canvas.getByText(/Open Cart/i);
    await userEvent.click(openCartButton);

    // Ensure dialog opens
    await waitFor(() => {
      expect(canvas.getByText('Cart')).toBeInTheDocument();
    });

    // Ensure checkout button is present
    await waitFor(() => {
      expect(canvas.getByText('Checkout')).toBeInTheDocument();
    });

    // Click checkout
    const checkoutButton = canvas.getByText(/Checkout/i);
    await userEvent.click(checkoutButton);
  },
};

/**
 * Empty Cart.
 */
export const EmptyCart: Story = {
  args: {
    cartItems: [],
    onUpdateQuantity: (id, quantity) =>
      console.log(`Update ${id} to ${quantity}`),
    onRemoveProduct: (id) => console.log(`Removed ${id}`),
    onCheckout: () => console.log('Checkout clicked'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open cart dialog
    const openCartButton = canvas.getByText(/Open Cart/i);
    await userEvent.click(openCartButton);

    // Ensure "Your cart is empty" message appears
    await waitFor(() => {
      expect(canvas.getByText('Your cart is empty.')).toBeInTheDocument();
    });
  },
};

/**
 * InteractiveCart Component (Fix: Wrap `useState` inside a React component).
 */
const InteractiveCartComponent: React.FC = () => {
  const [cartItems, setCartItems] =
    useState<CartProps['cartItems']>(mockCartItems);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveProduct = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Cart
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveProduct={handleRemoveProduct}
      onCheckout={() => console.log('Proceeding to checkout...')}
    />
  );
};

/**
 * Interactive Cart Story.
 */
export const InteractiveCart: Story = {
  render: () => <InteractiveCartComponent />, 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open cart dialog
    const openCartButton = canvas.getByText(/Open Cart/i);
    await userEvent.click(openCartButton);

    // Ensure cart opens
    await waitFor(() => {
      expect(canvas.getByText('Cart')).toBeInTheDocument();
    });

    // ✅ Change quantity of Product 1
    const quantityInput = canvas.getAllByRole('spinbutton')[0];
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '3');

    // ✅ Remove Product 2
    const removeButton = canvas.getAllByLabelText('Remove product')[1];
    await userEvent.click(removeButton);

    // ✅ Ensure Product 2 is removed
    await waitFor(() => {
      expect(canvas.queryByText('Product 2')).toBeNull();
    });

    // ✅ Ensure Checkout Button is still visible
    await waitFor(() => {
      expect(canvas.getByText('Checkout')).toBeInTheDocument();
    });
  },
};
