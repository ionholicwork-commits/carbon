import React from 'react';

interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error', onClose, className = '' }) => {
  const baseStyle = "p-4 rounded-lg shadow-lg mb-4 flex items-start gap-3 animate-slideIn";

  const typeStyles = {
    error: "bg-red-900 border-l-4 border-red-500 text-red-100",
    success: "bg-green-900 border-l-4 border-green-500 text-green-100",
    info: "bg-sky-900 border-l-4 border-sky-500 text-sky-100",
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-6 h-6 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 flex-shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!message) return null;

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${className}`} role="alert">
      {getIcon()}
      <div className="flex-1 whitespace-pre-wrap leading-relaxed">
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
