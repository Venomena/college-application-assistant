import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'default' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', ...props }) => {
  let className = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none';
  if (variant === 'primary') {
    className += ' bg-green-600 text-white hover:bg-blue-700';
  } else if (variant === 'ghost') {
    className += ' bg-transparent text-gray-600 hover:bg-gray-100';
  }
  if (size === 'icon') {
    className += ' p-2';
  } else {
    className += ' py-2 px-4';
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
