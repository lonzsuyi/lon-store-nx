'use client';

import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';

/**
 * Props for the Dialog component.
 */
export interface DialogProps {
  isOpen: boolean; // Whether the dialog is open or not.
  onClose: () => void; // Function to close the dialog.
  title?: string; // Dialog title (optional).
  children: React.ReactNode; // Dialog content.
  showCloseButton?: boolean; // Show close button (default: `true`).
  position?: 'top' | 'center' | 'bottom'; // Position of the dialog (`top`, `center`, `bottom`).
  variant?: 'blank' | 'confirm'; // Dialog variant (`blank` by default).
  confirmText?: string; // Custom text for the confirm content.
  confirmBtnText?: string; // Custom text for the confirm button.
  onConfirm?: () => void; // Callback when confirm button is clicked.
  className?: string;
}

/**
 * `Dialog` component for displaying modals.
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  position = 'center',
  variant = 'blank',
  confirmText = '',
  confirmBtnText = 'Close',
  onConfirm,
  className,
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
    top: 'top-6', // Fix: Moves modal to the top
    center: 'top-1/2 -translate-y-1/2', // Fix: Centers modal correctly
    bottom: 'bottom-6', // Fix: Moves modal to the bottom
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center overflow-y-auto mt-[65px]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={twMerge(
          'absolute',
          positionClasses[position],
          'bg-white rounded-lg shadow-lg mx-3 md:mx-0 flex-col min-w-[calc(100vw-24px)] md:min-w-[28rem] flex max-h-[calc(100vh-8rem)]'
        )}
      >
        {/* Sticky Header */}
        <div className="sticky rounded-t-lg top-0 bg-white px-4 py-3 flex justify-between items-center border-b border-gray-300 z-10">
          {title && <h2 className="text-lg font-medium">{title}</h2>}
          {showCloseButton && (
            <Icon
              className="text-gray-400 cursor-pointer"
              name="CircleX"
              size={18}
              aria-label="Close dialog"
              onClick={onClose}
            />
          )}
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-4 py-4 flex-1 rounded-b-lg mb-1"
          style={{ maxHeight: 'calc(100vh - 12rem)' }}
        >
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
    </div>
  );
};

export default Dialog;
