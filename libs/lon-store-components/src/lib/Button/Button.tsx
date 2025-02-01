import { twMerge } from 'tailwind-merge';

// Define the button properties
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'green' | 'black'; // Button style variant
  size?: 'md'; // Button size options
}

// Button component
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-bold rounded-xl transition duration-200';

  // Size-specific styles
  const sizeStyles = {
    md: 'h-[38px] px-4 text-sm',
  };

  // Variant-specific styles
  const variantStyles = {
    blue: 'bg-blue-700 text-white hover:bg-blue-900',
    green: 'bg-green-700 text-white hover:bg-green-900',
    black: 'bg-black text-white hover:bg-black-700',
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
