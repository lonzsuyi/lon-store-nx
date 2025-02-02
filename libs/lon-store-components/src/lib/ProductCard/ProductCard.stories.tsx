import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ProductCard } from './ProductCard';

/**
 * Storybook metadata for the ProductCard component.
 */
const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['regular', 'mini'],
      description: 'Product card variant',
    },
    imageSrc: { control: 'text', description: 'Product image URL' },
    title: { control: 'text', description: 'Product title' },
    price: { control: 'text', description: 'Product price' },
    rating: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Product rating',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

/**
 * Regular Product Card.
 */
export const Regular: Story = {
  args: {
    variant: 'regular',
    imageSrc: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    title: 'Regular Product',
    price: 20.0,
    rating: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const addToCartButton = canvas.getByText('Add to Cart');

    await userEvent.click(addToCartButton);
    expect(addToCartButton).toBeInTheDocument();
  },
};

/**
 * Component for Storybook to manage quantity state.
 */
const MiniProductCardStory: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <ProductCard
      variant="mini"
      imageSrc="https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
      title="Solid Gold Petite Micropave"
      price={15.0}
      quantity={quantity}
      onQuantityChange={(value) => {
        setQuantity(value);
        console.log(`Quantity updated: ${value}`);
      }}
    />
  );
};

/**
 * Mini Product Card.
 */
export const Mini: Story = {
  render: () => <MiniProductCardStory />,
  args: {
    variant: 'mini',
    imageSrc: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    title: 'Solid Gold Petite Micropave',
    price: 15.0,
    quantity: 1,
    onQuantityChange: (value) => console.log(`Quantity updated: ${value}`),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const removeButton = canvas.getByLabelText('Remove product');

    await userEvent.click(removeButton);
    expect(removeButton).toBeInTheDocument();
  },
};
