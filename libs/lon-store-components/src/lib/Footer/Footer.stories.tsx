import type { Meta, StoryObj } from '@storybook/react';
import { within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Footer } from './Footer';

/**
 * Storybook metadata for the Footer component.
 */
const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'Footer statement' },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

/**
 * Default Footer example.
 */
export const Default: Story = {
  args: {
    text: '© 2025 Your Company. All rights reserved.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the footer text to appear
    await waitFor(() => {
      expect(canvas.getByText('© 2025 Your Company. All rights reserved.')).toBeInTheDocument();
    });
  },
};