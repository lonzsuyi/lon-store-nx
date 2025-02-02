import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Props for the Icon component.
 */
export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: keyof typeof LucideIcons; // The name of the icon from `lucide-react`.
  size?: number; // The size of the icon (default: 24).
  color?: string; // The color of the icon (default: `currentColor`).
  className?: string; // Additional custom CSS classes.
}

/**
 * `Icon` component for rendering icons from `lucide-react`.
 */
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', className = '', ...props }) => {
  // Ensure the icon exists
  const LucideIcon = LucideIcons[name] as React.ElementType;

  if (!LucideIcon) {
    console.error(`Icon "${name}" not found in lucide-react.`);
    return null;
  }

  return <LucideIcon data-testid="icon-element" size={size} color={color} className={className} {...props} />;
};

export default Icon;