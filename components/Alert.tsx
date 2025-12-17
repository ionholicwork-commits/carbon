import React from 'react';

interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
  className?: string; // Added className prop
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error', onClose, className = '' }) => {
  const baseStyle = "p-4 rounded-md shadow-lg mb-4 flex justify-between items-start";
  const typeStyles = {
    error: "bg-red-800 border border-red-700 text-red-100",
    success: "bg-green-800 border border-green-700 text-green-100",
    info: "bg-sky-800 border border-sky-700 text-sky-100",
  };

  if (!message) return null;

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${className}`} role="alert">
      <p>{message}</p>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;