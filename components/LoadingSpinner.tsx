
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 max-w-xs sm:max-w-sm mx-auto">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-sky-500 border-t-transparent shadow-lg shadow-sky-500/20`}
      ></div>
      {text && (
        <p className="text-sky-300 text-sm sm:text-base font-medium text-center animate-pulse leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
