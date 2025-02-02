import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { useState } from 'react';
import { Dialog } from './Dialog';

/**
 * Storybook metadata for the Dialog component.
 */
const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the dialog is open' },
    title: { control: 'text', description: 'Dialog title' },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Dialog size',
    },
    showCloseButton: { control: 'boolean', description: 'Show close button' },
    position: {
      control: 'radio',
      options: ['top', 'center', 'bottom'],
      description: 'Dialog position',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/**
 * Default dialog example.
 */
export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Default Dialog',
    children: <p>This is a simple dialog in the center.</p>,
    position: 'center',
  },
};

/**
 * Dialog positioned at the top.
 */
export const TopDialog: Story = {
  args: {
    isOpen: true,
    title: 'Top Dialog',
    children: <p>This dialog appears at the top.</p>,
    position: 'top',
  },
};

/**
 * Dialog positioned at the bottom.
 */
export const BottomDialog: Story = {
  args: {
    isOpen: true,
    title: 'Bottom Dialog',
    children: <p>This dialog appears at the bottom.</p>,
    position: 'bottom',
  },
};

/**
 * Interactive dialog (click to open/close).
 */
export const Interactive: Story = {
  args: {
    title: 'Interactive Dialog',
    children: <p>Click outside or press Escape to close.</p>,
    position: 'center',
  },
  render: (args) => {
    const InteractiveDialog = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsOpen(true)}
          >
            Open Dialog
          </button>
          <Dialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      );
    };

    return <InteractiveDialog />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dialog
    const openButton = canvas.getByText('Open Dialog');
    await userEvent.click(openButton);

    // Wait for the dialog to appear
    await waitFor(() => {
      expect(canvas.getByText('Interactive Dialog')).toBeInTheDocument();
    });

    // Close the dialog
    const closeButton = canvas.getByLabelText('Close dialog');
    await userEvent.click(closeButton);

    // Wait for the dialog to disappear
    await waitFor(() => {
      expect(canvas.queryByText('Interactive Dialog')).toBeNull();
    });
  },
};

/**
 * comfirm dialog (click to open/close).
 */
export const ConfirmDialog: Story = {
  args: {
    isOpen: true,
    title: 'Order Confirmation',
    position: 'top',
    variant: 'confirm',
    confirmText: 'Thank you for your order!',
    confirmBtnText: 'Close',
  },
};

export const InteractiveConfirm: Story = {
  render: (args) => {
    const InteractiveDialog = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsOpen(true)}
          >
            Open Confirm Dialog
          </button>
          <Dialog
            {...args}
            variant="confirm"
            title="Order Confirmation"
            position="top"
            confirmText="Thank you for your order!"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => {
              console.log('Confirmed!');
              setIsOpen(false);
            }}
          />
        </div>
      );
    };

    return <InteractiveDialog />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ✅ Open the confirm dialog
    const openButton = await canvas.findByText(/open confirm dialog/i);
    await userEvent.click(openButton);

    // ✅ Wait for the dialog container to appear first
    const modal = await canvas.findByRole('dialog');

    // ✅ Then find the "Confirmation Dialog" inside the modal
    await waitFor(() => {
      expect(
        within(modal).getByText(/order confirmation/i)
      ).toBeInTheDocument();
    });

    // ✅ Click Confirm button inside the modal
    const confirmButton = await within(modal).findByText(/close/i);
    await userEvent.click(confirmButton);

    // ✅ Ensure the modal disappears after clicking Confirm
    await waitFor(() => {
      expect(canvas.queryByRole('dialog')).toBeNull();
    });
  },
};
