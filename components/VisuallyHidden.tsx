import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
}

/**
 * 화면에는 보이지 않지만 스크린 리더에서는 읽을 수 있는 컴포넌트
 * 접근성 개선을 위한 유틸리티 컴포넌트
 */
const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

export default VisuallyHidden;
