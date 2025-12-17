
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = "AI 생성 중..." }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex justify-center items-center z-50 rounded-lg transition-all duration-300">
      <LoadingSpinner text={message} />
    </div>
  );
};

export default LoadingOverlay;
