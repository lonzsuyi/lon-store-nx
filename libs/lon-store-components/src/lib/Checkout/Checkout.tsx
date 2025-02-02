import React, { useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { TextField } from '../TextField/TextField';
import { Cart } from '../Cart/Cart';
import { Button } from '../Button/Button';

/**
 * Type for cart items in Checkout.
 */
export interface CartItem {
  id: string;
  imageSrc: string;
  title: string;
  price: number;
  quantity: number;
}

/**
 * Type for form data in Checkout.
 */
export interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

/**
 * Props for the Checkout component.
 */
export interface CheckoutProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveProduct: (id: string) => void;
  onCheckout: (formData: CheckoutFormData) => void;
  nextBtnTxt?: string;
}

/**
 * `Checkout` component that displays a checkout form inside a dialog.
 */
export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveProduct,
  onCheckout,
  nextBtnTxt = 'Confirm Order',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    name: '',
    address: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { email, name, address, cardNumber, expiry, cvc } = formData;
    if (!email || !name || !address || !cardNumber || !expiry || !cvc) {
      alert('Please fill in all fields.');
      return;
    }
    onCheckout(formData);
    setIsOpen(false);
  };

  return (
    <>
      {/* Open Checkout Button */}
      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Proceed to Checkout
      </Button>

      {/* Checkout Dialog */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Checkout">
        <div className="flex flex-col gap-6">
          {/* Shipping Information */}
          <div className="border-b border-b-gray-200 pb-6">
            <h2 className="text-base font-medium text-black mb-2">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Email"
                fieldType="email"
                isRequired
                value={formData.email}
                onChange={(e) =>
                  handleChange('email', e.target.value.toString())
                }
              />
              <TextField
                label="Name"
                fieldType="text"
                isRequired
                value={formData.name}
                onChange={(e) =>
                  handleChange('name', e.target.value.toString())
                }
              />
              <TextField
                label="Address"
                fieldType="text"
                isRequired
                className="sm:col-span-2"
                value={formData.address}
                onChange={(e) =>
                  handleChange('address', e.target.value.toString())
                }
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-b border-b-gray-200 pb-6">
            <h2 className="text-base font-medium text-black mb-2">Payment</h2>
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Card Number"
                fieldType="bankCard"
                isRequired
                value={formData.cardNumber}
                onChange={(e) =>
                  handleChange('cardNumber', e.target.value.toString())
                }
              />
              <TextField
                label="Card Name"
                fieldType="bankCard"
                isRequired
                value={formData.cardName}
                onChange={(e) =>
                  handleChange('cardName', e.target.value.toString())
                }
              />
            </div>
            {/* Expiry & CVC on same row for small screens */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <TextField
                label="Expiry (MM/YY)"
                fieldType="bankCardExpiry"
                isRequired
                value={formData.expiry}
                onChange={(e) =>
                  handleChange('expiry', e.target.value.toString())
                }
              />
              <TextField
                label="CVC"
                fieldType="cvc"
                isRequired
                value={formData.cvc}
                onChange={(e) => handleChange('cvc', e.target.value.toString())}
              />
            </div>
          </div>

          {/* Cart Items */}
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveProduct={onRemoveProduct}
            onNextClick={handleSubmit}
            nextBtnTxt={nextBtnTxt}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Checkout;
