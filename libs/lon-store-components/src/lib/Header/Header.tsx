import React from 'react';
import { Icon } from '../Icon/Icon';

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  cartCount?: number; // Number of items in the shopping cart.
}

/**
 * `Header` component with a left icon, a right shopping cart icon, and a dynamic cart count.
 */
export const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  return (
    <header className="w-full h-[65px] flex justify-between items-center px-4  shadow-md">
      {/* Left Icon */}
      <Icon
        name="Zap"
        size={25}
        strokeWidth={0}
        fill="#4F46E5"
        className="text-blue-700"
        data-testid="zap-icon"
      />

      {/* Shopping Cart + Count */}
      <div className="relative flex items-center">
        <Icon
          name="ShoppingBasket"
          size={24}
          className="text-gray-150"
          data-testid="shopping-cart"
        />
        <span className="ml-1 text-gray-150 text-sm font-medium">X {cartCount}</span>
      </div>
    </header>
  );
};

export default Header;
