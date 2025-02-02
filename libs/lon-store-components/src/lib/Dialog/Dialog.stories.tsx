import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

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
 * Interactive Dynamic Dialog Example.
 */
export const InteractiveDynamicDialog: Story = {
  render: (args) => {
    const DynamicDialog = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [variant, setVariant] = useState<'blank' | 'confirm'>('blank');
      const [confirmText, setConfirmText] = useState('');

      return (
        <div className="flex flex-col items-center gap-4">
          {/* Toggle Dialog Type */}
          <div className="flex gap-2">
            <Button variant="blue" onClick={() => {
              setVariant('blank');
              setIsOpen(true);
            }}>
              Open Blank Dialog
            </Button>
            <Button variant="green" onClick={() => {
              setVariant('confirm');
              setConfirmText('Your action has been confirmed.');
              setIsOpen(true);
            }}>
              Open Confirm Dialog
            </Button>
          </div>

          {/* Dialog Component */}
          <Dialog
            {...args}
            isOpen={isOpen}
            variant={variant}
            title={variant === 'blank' ? 'Regular Dialog' : 'Confirmation'}
            confirmText={confirmText}
            confirmBtnText="OK"
            onClose={() => setIsOpen(false)}
            onConfirm={() => {
              console.log('Confirmed!');
              setIsOpen(false);
            }}
          >
            {variant === 'blank' && <p>This is a regular dialog.</p>}
          </Dialog>
        </div>
      );
    };

    return <DynamicDialog />;
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click "Open Blank Dialog"
    const openBlankButton = canvas.getByText(/open blank dialog/i);
    await userEvent.click(openBlankButton);

    // Ensure the blank dialog appears
    await waitFor(() => {
      expect(canvas.getByText('Regular Dialog')).toBeInTheDocument();
    });

    // Close the dialog
    const closeButton = canvas.getByLabelText('Close dialog');
    await userEvent.click(closeButton);

    // Ensure the dialog disappears
    await waitFor(() => {
      expect(canvas.queryByText('Regular Dialog')).toBeNull();
    });

    // Click "Open Confirm Dialog"
    const openConfirmButton = canvas.getByText(/open confirm dialog/i);
    await userEvent.click(openConfirmButton);

    // Ensure the confirmation dialog appears
    await waitFor(() => {
      expect(canvas.getByText('Your action has been confirmed.')).toBeInTheDocument();
    });

    // Click "OK" in the confirm dialog
    const confirmButton = canvas.getByText('OK');
    await userEvent.click(confirmButton);

    // Ensure the confirm dialog disappears
    await waitFor(() => {
      expect(canvas.queryByText('Your action has been confirmed.')).toBeNull();
    });
  },
};