
import React from 'react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirmReset: () => void;
  onConfirmKeep: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirmReset,
  onConfirmKeep,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-900/30 mb-4">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="text-gray-300 text-sm mb-6 whitespace-pre-wrap leading-relaxed text-left">
            {message}
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={onConfirmReset} variant="primary" className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-none shadow-red-900/20">
              시나리오 초기화 후 적용
            </Button>
            <Button onClick={onConfirmKeep} variant="secondary" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600">
              시나리오 유지하고 적용
            </Button>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium py-2 transition-colors"
            >
              취소 (변경 취소)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
