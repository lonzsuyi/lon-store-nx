import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Rate } from './Rate';

const meta: Meta<typeof Rate> = {
  title: 'Components/Rate', // Display name in Storybook
  component: Rate,
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum stars',
    },
    value: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Current rating value',
    },
    interactive: { control: 'boolean', description: 'Allow user interaction' },
    size: {
      control: { type: 'number', min: 12, max: 100 },
      description: 'Star size',
    },
    activeColor: { control: 'color', description: 'Color of filled stars' },
    inactiveColor: { control: 'color', description: 'Color of empty stars' },
  },
};
export default meta;
type Story = StoryObj<typeof Rate>;

/**
 * Default (static) rating.
 */
export const Default: Story = {
  args: {
    value: 3,
    max: 5,
    interactive: false,
  },
};

/**
 * Interactive rating (click to rate).
 */
export const Interactive: Story = {
  args: {
    value: 3,
    max: 5,
    interactive: true,
  },
  render: (args) => {
    const InteractiveRate = () => {
      const [rating, setRating] = useState(args.value);
      return <Rate {...args} value={rating} onChange={setRating} />;
    };

    return <InteractiveRate />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the 5th star
    const fifthStar = canvas.getByTestId('rate-star-5');
    await userEvent.click(fifthStar);

    // Wait for the rating to update
    await waitFor(() => {
      expect(fifthStar).toHaveAttribute('stroke', '#FABE3A'); // Should be filled (yellow)
    });
  },
};

/**
 * Large stars example.
 */
export const LargeStars: Story = {
  args: {
    value: 4,
    max: 5,
    interactive: true,
    size: 48,
    activeColor: '#FACC15', // Tailwind yellow-300
    inactiveColor: '#9CA3AF', // Tailwind gray-400
  },
};

// export const Primary = {
//   args: {},
// };

// export const Heading: Story = {
//   args: {},
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     expect(canvas.getByText(/Welcome to Rate!/gi)).toBeTruthy();
//   },
// };
