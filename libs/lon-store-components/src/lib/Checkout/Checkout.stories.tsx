import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
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
 * Default Checkout.
 */
export const Default: Story = {
  args: {
    cartItems: mockCartItems,
    onUpdateQuantity: (id: string, quantity: number) =>
      console.log(`Updated quantity for ${id}: ${quantity}`),
    onRemoveProduct: (id: string) => console.log(`Removed product ${id}`),
    onCheckout: (formData: CheckoutFormData) =>
      console.log('Checkout Form Data:', formData),
  },
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
  
    // Ensure we target **ONLY the Shipping Name** field
    await userEvent.type(
      canvas.getByRole('textbox', { name: /^Name$/i }), // 👈 Exact match
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
      canvas.getByRole('textbox', { name: /Card Name/i }), //  More specific
      'John Doe'
    );
  
    await userEvent.type(
      canvas.getByRole('textbox', { name: /Expiry/i }),
      '12/25'
    );
  
    await userEvent.type(
      canvas.getByRole('textbox', { name: /CVC/i }),
      '123'
    );
  
    // Click Confirm Order
    const confirmOrderButton = canvas.getByText(/Confirm Order/i);
    await userEvent.click(confirmOrderButton);
  
    // Ensure Dialog Closes on Submit
    await waitFor(() => {
      expect(canvas.queryByText('Checkout')).toBeNull();
    });
  }
};