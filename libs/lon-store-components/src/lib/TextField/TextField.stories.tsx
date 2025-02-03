import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { waitFor, within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { TextField } from './TextField';

import type { TextFieldProps } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Field label' },
    variant: {
      control: 'radio',
      options: ['default', 'outline'],
      description: 'Input variant style',
    },
    fieldSize: { control: 'radio', options: ['md'], description: 'Input size' },
    isRequired: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    type: {
      control: 'radio',
      options: ['text', 'tel', 'email', 'password', 'number'],
      description: 'HTML input type (validation applied automatically)',
    },
    placeholder: { control: 'text', description: 'Placeholder text' },
    error: { control: 'text', description: 'Error message for validation' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// Story with working onChange
const Template = (args: TextFieldProps) => {
  const [value, setValue] = useState('');
  return (
    <TextField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

// Default TextField
export const Default: Story = {
  render: Template,
  args: {
    label: 'Full Name',
    variant: 'default',
    fieldSize: 'md',
    placeholder: 'Enter your name...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Enter your name...');
    await userEvent.type(input, 'John Doe');
    expect(input).toHaveValue('John Doe');
  },
};

// Required Email Field
export const RequiredEmail: Story = {
  render: Template,
  args: {
    label: 'Email Address',
    fieldType: 'email',
    variant: 'default',
    fieldSize: 'md',
    placeholder: 'example@mail.com',
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('example@mail.com');

    // Leave empty and blur (test required validation)
    await userEvent.click(input);
    await userEvent.tab();
    expect(canvas.getByText('This field is required.')).toBeTruthy();

    // Enter valid email and check that the error disappears
    await userEvent.type(input, 'test@example.com');
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.queryByText('This field is required.')).toBeNull();
    });
  },
};

// Required Card Number
export const RequiredCardNumber: Story = {
  render: Template,
  args: {
    label: 'Card Number',
    variant: 'default',
    fieldSize: 'md',
    fieldType: 'bankCard',
    placeholder: '1234 5678 9012 3456',
    maxLength: 19,
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('1234 5678 9012 3456');

    // Type an invalid card number
    await userEvent.type(input, '12345678');
    await userEvent.tab();
    // Wait for the validation message to appear
    await waitFor(() => {
      expect(
        canvas.getByText('Invalid card number (13-19 digits).')
      ).toBeTruthy();
    });

    // Clear input and type a valid card number
    await userEvent.clear(input);
    await userEvent.type(input, '1234567812345678');
    await userEvent.tab();
    // Wait for the validation message to disappear
    await waitFor(() => {
      expect(
        canvas.queryByText('Invalid card number (13-19 digits).')
      ).toBeNull();
    });
  },
};

// Required Expiry Date
export const RequiredExpiry: Story = {
  render: Template,
  args: {
    label: 'Expiry Date',
    variant: 'default',
    fieldSize: 'md',
    fieldType: 'bankCardExpiry',
    placeholder: 'MM/YY',
    name: 'expiry',
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('MM/YY');

    // Type an invalid expiry date
    await userEvent.type(input, '99/99');
    // Simulate losing focus (blur event) to trigger validation
    await userEvent.tab();

    // Wait for validation message to appear
    await waitFor(() => {
      expect(
        canvas.getByText('Invalid expiry format (MM/YY).')
      ).toBeTruthy();
    });

    // Clear input and type a valid expiry date
    await userEvent.clear(input);
    await userEvent.type(input, '12/25');
    await userEvent.tab();
    // Wait for the validation message to disappear
    await waitFor(() => {
      expect(
        canvas.queryByText('Invalid expiry format (MM/YY).')
      ).toBeNull();
    });
  },
};

// Required CVC
export const RequiredCVC: Story = {
  render: Template,
  args: {
    label: 'CVC',
    variant: 'default',
    fieldSize: 'md',
    fieldType: 'cvc',
    placeholder: '123',
    name: 'cvc',
    maxLength: 3,
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('123');

    await userEvent.type(input, '12');
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.getByText('Invalid CVC (3-4 digits).')).toBeTruthy();
    });

    await userEvent.clear(input);
    await userEvent.type(input, '1234');
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.queryByText('Invalid CVC (3-4 digits).')).toBeNull();
    });
  },
};

// Required Numeric Field
export const RequiredNumber: Story = {
  render: Template,
  args: {
    label: '',
    variant: 'default',
    fieldSize: 'md',
    fieldType: 'number',
    placeholder: 'Enter number',
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Enter number');

    await userEvent.type(input, 'abc');
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.getByText('Only numbers are allowed.')).toBeTruthy();
    });

    await userEvent.clear(input);
    await userEvent.type(input, '25');
    await userEvent.tab();
    await waitFor(() => {
      expect(canvas.queryByText('Only numbers are allowed.')).toBeNull();
    });
  },
};

// Play function for required email validation
export const RequiredEmailValidationTest: Story = {
  render: Template,
  args: {
    label: 'Email Address',
    variant: 'default',
    fieldSize: 'md',
    placeholder: 'example@mail.com',
    isRequired: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('example@mail.com');

    // Leave the input empty and trigger blur
    await userEvent.click(input);
    await userEvent.tab();
    expect(canvas.getByText('This field is required.')).toBeTruthy();

    // Type a valid email and check error disappears
    await userEvent.type(input, 'test@example.com');
    await userEvent.tab();
    expect(canvas.queryByText('This field is required.')).toBeNull();
  },
};
