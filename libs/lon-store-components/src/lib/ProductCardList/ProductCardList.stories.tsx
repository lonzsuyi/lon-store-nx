import type { Meta, StoryObj } from '@storybook/react';
import { ProductCardList } from './ProductCardList.client';

/**
 * Storybook metadata for the ProductCardList component.
 */
const meta: Meta<typeof ProductCardList> = {
  title: 'Layout/ProductCardList',
  component: ProductCardList,
  tags: ['autodocs'],
  argTypes: {
    initialLoad: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description: 'Initial number of products to load',
    },
    loadMore: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description: 'Number of products to load on scroll',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCardList>;

/**
 * Mock Product Data.
 */
const mockProducts = Array.from({ length: 30 }, (_, index) => ({
  id: `${index + 1}`,
  imageSrc: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
  title: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 100) + 10,
  rating: Math.floor(Math.random() * 5) + 1,
}));

/**
 * Default ProductCardList with Infinite Scroll.
 */
export const Default: Story = {
  args: {
    products: mockProducts,
    initialLoad: 6,
    loadMore: 6,
  },
};