import type { Meta, StoryObj } from '@storybook/react';
import { within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import * as LucideIcons from 'lucide-react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(LucideIcons), // List all available icons
      description: 'Select an icon from lucide-react',
    },
    size: {
      control: { type: 'number', min: 12, max: 100 },
      description: 'Icon size in pixels',
    },
    color: { control: 'color', description: 'Icon color' },
    className: { control: 'text', description: 'Custom CSS classes' },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

/**
 * Default icon example.
 */
export const Default: Story = {
  args: {
    name: 'ArrowRight', // Default icon
    size: 32,
    color: '#000000',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the icon to render
    await waitFor(() => {
      const icon = canvas.getByTestId('icon-element');
      expect(icon).toBeTruthy();
      expect(icon).toHaveAttribute('width', '32');
      expect(icon).toHaveAttribute('height', '32');
      expect(icon).toHaveAttribute('stroke', '#000000');
    });
  },
};

/**
 * Small Icon Example.
 */
export const Small: Story = {
  args: {
    name: 'CheckCircle',
    size: 16,
    color: '#10B981', // Tailwind green-500
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const icon = canvas.getByTestId('icon-element');
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
      expect(icon).toHaveAttribute('stroke', '#10B981');
    });
  },
};

/**
 * Large Icon Example.
 */
export const Large: Story = {
  args: {
    name: 'Heart',
    size: 48,
    color: '#EF4444', // Tailwind red-500
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const icon = canvas.getByTestId('icon-element');
      expect(icon).toHaveAttribute('width', '48');
      expect(icon).toHaveAttribute('height', '48');
      expect(icon).toHaveAttribute('stroke', '#EF4444');
    });
  },
};
