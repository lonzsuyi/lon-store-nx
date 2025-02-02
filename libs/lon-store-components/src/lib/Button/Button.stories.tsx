import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['blue', 'green', 'black'],
      description: 'Button variant style',
    },
    size: {
      control: 'radio',
      options: ['md'],
      description: 'Button size',
    },
    onClick: { action: 'clicked' }, // Simulate click event in Storybook
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

// Blue button
export const Primary: Story = {
  args: {
    children: 'Blue Button',
    variant: 'blue',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Blue Button/gi)).toBeTruthy();
  },
};

// Green button
export const Secondary: Story = {
  args: {
    children: 'Green Button',
    variant: 'green',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Green Button/gi)).toBeTruthy();
  },
};

// Black button
export const Black: Story = {
  args: {
    children: 'Black Button',
    variant: 'black',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Black Button/gi)).toBeTruthy();
  },
};
