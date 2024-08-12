import React from "react";

interface LoadingSpinnerProps {
  loadingText: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loadingText }) => {
  return (
    <div className="flex flex-col items-center mt-4 mb-4">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
      <p className="mt-2 text-gray-600">{loadingText}</p>
    </div>
  );
};

export default LoadingSpinner;
