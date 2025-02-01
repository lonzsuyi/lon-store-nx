import type { Meta, StoryObj } from '@storybook/react';
import { within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Picture } from './Picture';

const meta: Meta<typeof Picture> = {
  title: 'Components/Picture',
  component: Picture,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text', description: 'Image URL' },
    alt: { control: 'text', description: 'Alternative text' },
    srcSet: { control: 'text', description: 'Optional responsive images' },
    loading: {
      control: 'radio',
      options: ['lazy', 'eager'],
      description: 'Lazy loading setting',
    },
    className: { control: 'text', description: 'Custom CSS classes' },
  },
};
export default meta;
type Story = StoryObj<typeof Picture>;

// Default Picture
export const Default: Story = {
  args: {
    src: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    alt: 'Placeholder image',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the image to load
    await waitFor(() => {
      const image = canvas.getByRole('img');
      expect(image).toHaveAttribute(
        'src',
        'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
      );
      expect(image).toHaveAttribute('alt', 'Placeholder image');
    });
  },
};

// Picture with srcSet for responsive images
export const Responsive: Story = {
  args: {
    src: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    srcSet:
      'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg 2x, https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg 3x',
    alt: 'Responsive placeholder image',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the image and source element to load
    await waitFor(() => {
      const image = canvas.getByRole('img');
      expect(image).toHaveAttribute(
        'src',
        'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
      );
      // const source = canvas.getByRole('presentation'); // <source> is not directly accessible, but this checks its presence
      // expect(source).toHaveAttribute(
      //   'srcset',
      //   'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg 2x, https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg 3x'
      // );
    });
  },
};

// Eager Loading Example
export const EagerLoading: Story = {
  args: {
    src: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    alt: 'Eager loaded image',
    loading: 'eager',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the image to load
    await waitFor(() => {
      const image = canvas.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager');
    });
  },
};
