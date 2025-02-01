import type { Meta, StoryObj } from '@storybook/react';
import { within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Header } from './Header';

/**
 * Storybook metadata for the Header component.
 */
const meta: Meta<typeof Header> = {
  title: 'Pages/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    cartCount: { control: { type: 'number', min: 0 }, description: 'Number of items in the cart' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default Header with no cart items.
 */
export const Default: Story = {
  args: {
    cartCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ensure shopping cart icon is present
    await waitFor(() => {
      expect(canvas.getByTestId('shopping-cart')).toBeInTheDocument();
    });

    // Ensure no badge appears when cartCount is 0
    await waitFor(() => {
      expect(canvas.queryByText('0')).toBeNull();
    });
  },
};

/**
 * Header with items in the cart.
 */
export const WithCartItems: Story = {
  args: {
    cartCount: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ensure shopping cart icon is present
    await waitFor(() => {
      expect(canvas.getByTestId('shopping-cart')).toBeInTheDocument();
    });

    // Ensure the correct cart count is displayed
    await waitFor(() => {
      expect(canvas.getByText('5')).toBeInTheDocument();
    });
  },
};