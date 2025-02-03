'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TextField, TextFieldRef } from '../TextField/TextField';
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
  formData?: CheckoutFormData;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveProduct: (id: string) => void;
  onCheckout: (form: CheckoutFormData) => void;
}

/**
 * `Checkout` component that displays a checkout form.
 */
export const Checkout: React.FC<CheckoutProps> = ({
  formData,
  cartItems,
  onUpdateQuantity,
  onRemoveProduct,
  onCheckout,
}) => {
  const [form, setForm] = useState<CheckoutFormData>({
    email: '',
    name: '',
    address: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });
  // Use the correct ref type `TextFieldRef`
  const fieldRefs = {
    email: useRef<TextFieldRef>(null),
    name: useRef<TextFieldRef>(null),
    address: useRef<TextFieldRef>(null),
    cardNumber: useRef<TextFieldRef>(null),
    cardName: useRef<TextFieldRef>(null),
    expiry: useRef<TextFieldRef>(null),
    cvc: useRef<TextFieldRef>(null),
  };

  useEffect(() => {
    if (formData) {
      setForm(formData);
    }
  }, [formData]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger `onBlur` on all fields to enforce validation
    Object.values(fieldRefs).forEach((ref) => ref.current?.triggerBlur());

    // Get all validation error messages
    const errors = Object.keys(fieldRefs).reduce((acc, key) => {
      const errorMsg =
        fieldRefs[key as keyof typeof fieldRefs]?.current?.getError() || '';
      return { ...acc, [key]: errorMsg };
    }, {} as Record<string, string>);

    // Check if any field has an error
    const hasError = Object.values(errors).some((error) => error !== '');
    if (hasError) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    onCheckout(form);
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Shipping Information */}
      <div className="border-b border-b-gray-200 pb-6">
        <h2 className="text-base font-medium text-black mb-2">
          Shipping Information
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <TextField
            ref={fieldRefs.email}
            label="Email"
            fieldType="email"
            isRequired
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <TextField
            ref={fieldRefs.name}
            label="Name"
            fieldType="text"
            isRequired
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <TextField
            ref={fieldRefs.address}
            label="Address"
            fieldType="text"
            isRequired
            className="sm:col-span-2"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
      </div>

      {/* Payment Section */}
      <div className="border-b border-b-gray-200 pb-6">
        <h2 className="text-base font-medium text-black mb-2">Payment</h2>
        <div className="grid grid-cols-1 gap-4">
          <TextField
            ref={fieldRefs.cardNumber}
            label="Card Number"
            fieldType="bankCard"
            isRequired
            value={form.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
          />
          <TextField
            ref={fieldRefs.cardName}
            label="Card Name"
            fieldType="text"
            isRequired
            value={form.cardName}
            onChange={(e) => handleChange('cardName', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextField
            ref={fieldRefs.expiry}
            label="Expiry (MM/YY)"
            fieldType="bankCardExpiry"
            isRequired
            value={form.expiry}
            onChange={(e) => handleChange('expiry', e.target.value)}
          />
          <TextField
            ref={fieldRefs.cvc}
            label="CVC"
            fieldType="cvc"
            isRequired
            value={form.cvc}
            onChange={(e) => handleChange('cvc', e.target.value)}
          />
        </div>
      </div>

      {/* Cart Items */}
      <Cart
        showSummary
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveProduct={onRemoveProduct}
        showNextBtn={false}
      />
      <Button variant="green" type="submit">
        Confirm Order
      </Button>
    </form>
  );
};

export default Checkout;
