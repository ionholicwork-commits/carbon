import React from 'react';

/**
 * 스크린 리더와 키보드 사용자를 위한 Skip to Content 링크
 * 포커스를 받기 전까지는 숨겨져 있다가 Tab 키를 누르면 표시됨
 */
const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-sky-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      본문으로 바로가기
    </a>
  );
};

export default SkipLink;
