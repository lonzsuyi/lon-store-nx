'use client';

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { twMerge } from 'tailwind-merge';

// Define the textfield properties
export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: 'default';
  fieldSize?: 'sm' | 'md';
  fieldType?:
    | 'email'
    | 'bankCard'
    | 'bankCardExpiry'
    | 'cvc'
    | 'number'
    | 'text';
  isRequired?: boolean; // New prop for required validation
  hideenErrMsg?: boolean;
  error?: string;
  initialValue?: string; // Used for SSR to provide static content
}

// Define the custom ref interface
export interface TextFieldRef {
  triggerBlur: () => void;
  getError: () => string;
}

// Validation function
const validateInput = (
  inputValue: string,
  fieldType: string,
  isRequired: boolean
): string => {
  if (isRequired && !inputValue.trim()) return 'This field is required.';
  switch (fieldType) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)
        ? ''
        : 'Invalid email format.';
    case 'bankCard':
      return /^\d{13,19}$/.test(inputValue)
        ? ''
        : 'Invalid card number (13-19 digits).';
    case 'bankCardExpiry':
      return /^(0[1-9]|1[0-2])\/\d{2}$/.test(inputValue)
        ? ''
        : 'Invalid expiry format (MM/YY).';
    case 'cvc':
      return /^\d{3,4}$/.test(inputValue) ? '' : 'Invalid CVC (3-4 digits).';
    case 'number':
      return /^\d+$/.test(inputValue) ? '' : 'Only numbers are allowed.';
    default:
      return '';
  }
};

// Function to map `fieldType` to HTML input `type`
const getInputType = (fieldType: TextFieldProps['fieldType']): string => {
  switch (fieldType) {
    case 'email':
      return 'email'; // Native email validation
    case 'bankCard':
    case 'number':
      return 'tel'; // Use 'tel' for numeric inputs to avoid up/down arrows in number fields
    case 'bankCardExpiry':
    case 'cvc':
      return 'text'; // Expiry and CVC should be plain text inputs
    default:
      return 'text';
  }
};

// TextField component
export const TextField = forwardRef<TextFieldRef, TextFieldProps>(
  (
    {
      label,
      variant = 'default',
      fieldSize = 'md',
      hideenErrMsg = false,
      error,
      fieldType = 'text',
      isRequired = false,
      initialValue = '',
      className = '',
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState('');
    const [touched, setTouched] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value?.toString());
      }
    }, [props.value]);

    // Expose methods for parent components
    useImperativeHandle(ref, () => ({
      triggerBlur: () => {
        setTouched(true);
        setValidationError(validateInput(value, fieldType, isRequired));
      },
      getError: () => validationError,
    }));

    // Base styles for input
    const baseStyles =
      'rounded-xl shadow-md border transition focus:ring-2 outline-none w-full ';

    // Size styles
    const sizeStyles = {
      md: 'px-3 h-[42px] text-sm',
      sm: 'px-3 h-[30px] text-sm',
    };

    // Variant styles
    const variantStyles = {
      default: 'border-gray-100 focus:ring-blue-500',
    };

    // Custom validation for bank cards, expiry dates, CVCs
    // const handleValidation = (inputValue: string) => {
    //   if (isRequired && !inputValue.trim()) {
    //     return 'This field is required.';
    //   }
    //   switch (fieldType) {
    //     case 'bankCard':
    //       return /^\d{13,19}$/.test(inputValue)
    //         ? ''
    //         : 'Invalid card number (13-19 digits).';
    //     case 'bankCardExpiry':
    //       return /^(0[1-9]|1[0-2])\/\d{2}$/.test(inputValue)
    //         ? ''
    //         : 'Invalid expiry format (MM/YY or MM/YYYY).';
    //     case 'cvc':
    //       return /^\d{3,4}$/.test(inputValue)
    //         ? ''
    //         : 'Invalid CVC (3-4 digits).';
    //     case 'email':
    //       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)
    //         ? ''
    //         : 'Invalid email format.';
    //     case 'number':
    //       return /^\d+$/.test(inputValue) ? '' : 'Only numbers are allowed.';
    //   }
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.toString());
      props.onChange?.(e);
    };

    const handleBlur = () => {
      setTouched(true);
      setValidationError(validateInput(value, fieldType, isRequired));
    };

    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm text-gray-600">{label}</label>}
        <input
          className={twMerge(
            baseStyles,
            sizeStyles[fieldSize],
            touched && (error || validationError)
              ? 'border-red-500 focus:ring-red-500'
              : variantStyles[variant],
            className
          )}
          type={getInputType(fieldType)} // Dynamically set `type` based on `fieldType
          role={fieldType === 'number' ? 'spinbutton' : undefined}
          aria-label={props['aria-label'] || label || 'Input field'}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {!hideenErrMsg && touched && (error || validationError) && (
          <p className="text-xs text-red-500" data-testid="error-message">
            {error || validationError}
          </p>
        )}
      </div>
    );
  }
);

export default TextField;
