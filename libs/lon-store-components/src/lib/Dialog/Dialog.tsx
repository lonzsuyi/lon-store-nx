import React, { useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';

/**
 * Props for the Dialog component.
 */
export interface DialogProps {
  isOpen: boolean; //  Whether the dialog is open or not.
  onClose: () => void; // Function to close the dialog.
  title?: string; // Dialog title (optional).
  children: React.ReactNode; // Dialog content.
  size?: 'sm' | 'md' | 'lg'; // Width of the dialog (default: `max-w-md`).
  showCloseButton?: boolean; // Show close button (default: `true`).
  position?: 'top' | 'center' | 'bottom'; // Position of the dialog (`top`, `center`, `bottom`).
  variant?: 'blank' | 'confirm'; // Dialog variant (`blank` by default).
  confirmText?: string; // Custom text for the confirm content.
  confirmBtnText?: string; // Custom text for the confirm button.
  onConfirm?: () => void; // Callback when confirm button is clicked.
}

/**
 * `Dialog` component for displaying modals.
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  position = 'center',
  variant = 'blank',
  confirmText = '',
  confirmBtnText = 'Close',
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    top: 'top-4', // Aligns modal at the top
    center: 'top-1/2 -translate-y-1/2', // Centers modal vertically
    bottom: 'bottom-4', // Aligns modal at the bottom
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`absolute ${
          positionClasses[position]
        } bg-white rounded-lg shadow-lg px-3 py-4 transition-transform transform scale-100 w-full max-w-md ${
          size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-md'
        }`}
      >
        {showCloseButton && (
          <Icon
            className="absolute top-6 right-4 text-gray-400 cursor-pointer"
            name="CircleX"
            size={18}
            aria-label="Close dialog"
            onClick={onClose}
          />
        )}
        {title && (
          <h2 className="pt-1 pb-4 text-lg text-black font-semibold mb-4 border-b border-b-gray-200">
            {title}
          </h2>
        )}
        {variant === 'blank' && <div>{children}</div>}
        {variant === 'confirm' && (
          <div>
            <p className="text-black text-2xl text-center">{confirmText}</p>
            <div className="mt-4">
              <Button
                className="w-full"
                variant="black"
                onClick={onConfirm || onClose}
              >
                {confirmBtnText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
