'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import type { RateProps } from './Rate.types';

/**
 * `Rate` component for star rating.
 */
export const Rate: React.FC<RateProps> = ({
  max = 5,
  value = 0,
  interactive = false,
  onChange,
  size = 20,
  activeColor = '#FABE3A',
  inactiveColor = '#E5E7EB',
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setHovered(value ? value : null);
    }
  }, [value]);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, index) => {
        const isFilled = index < (hovered !== null ? hovered : value);

        return (
          <Icon
            key={index}
            name="Star"
            size={size}
            fill={isFilled ? activeColor : inactiveColor}
            strokeWidth={0}
            className={interactive ? 'cursor-pointer' : 'cursor-auto'}
            onMouseEnter={() => interactive && setHovered(index + 1)}
            onMouseLeave={() => interactive && setHovered(null)}
            onClick={() => handleClick(index)}
            data-testid={`rate-star-${index + 1}`}
          />
        );
      })}
      <span className="text-gray-400 text-sm font-medium ml-1">
        ({value.toFixed(1)})
      </span>
    </div>
  );
};

export default Rate;
