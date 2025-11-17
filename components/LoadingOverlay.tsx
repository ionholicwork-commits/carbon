import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10 rounded-lg animate-fadeIn backdrop-blur-sm">
      <div className="animate-scaleIn">
        <LoadingSpinner text="AI 생성 중..." />
      </div>
    </div>
  );
};

export default LoadingOverlay;
