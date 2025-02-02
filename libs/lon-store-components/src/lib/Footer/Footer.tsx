import React from 'react';

/**
 * Props for the Footer component.
 */
export interface FooterProps {
  text?: string;
}

/**
 * `Footer` component for displaying a centered statement.
 */
export const Footer: React.FC<FooterProps> = ({
  text = 'The Fake Store Copyright 2024',
}) => {
  return (
    <footer className="h-[65px]  ">
      <p className="w-full h-full flex justify-center items-center border-t border-t-gray-200 font-medium text-sm text-gray-400">
        {text}
      </p>
    </footer>
  );
};

export default Footer;
