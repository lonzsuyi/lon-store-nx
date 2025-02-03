import React from 'react';
import { Icon } from '../Icon/Icon';
import type { RateProps } from './Rate.types';

/**
 * Non-interactive version of the Rate component for server-side rendering.
 */
export const RateServer: React.FC<RateProps> = ({
  max = 5,
  value = 0,
  size = 20,
  activeColor = '#FABE3A',
  inactiveColor = '#E5E7EB',
}) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, index) => {
        const isFilled = index < value;

        return (
          <Icon
            key={index}
            name="Star"
            size={size}
            fill={isFilled ? activeColor : inactiveColor}
            strokeWidth={0}
            className="cursor-auto"
          />
        );
      })}
      <span className="text-gray-400 text-sm font-medium ml-1">
        ({value.toFixed(1)})
      </span>
    </div>
  );
};

export default RateServer;