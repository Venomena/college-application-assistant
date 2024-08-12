import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
      {...props}
    />
  );
};