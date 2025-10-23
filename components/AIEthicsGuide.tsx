import React from 'react';

const AIEthicsGuide: React.FC = () => {
  
  const ethicsData = [
    {
      icon: (
        <>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </>
      ),
      title: "존중하는 사용",
      description: "타인을 불쾌하게 하거나 차별, 혐오를 조장하는 콘텐츠를 만들지 마세요.",
    },
    {
      icon: (
        <>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </>
      ),
      title: "책임감 있는 생성",
      description: "생성된 결과는 사용자의 책임입니다. 허위 정보를 만들거나 퍼뜨리지 마세요.",
    },
    {
      icon: (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ),
      title: "정직한 활용",
      description: "AI 생성물을 이용하여 타인을 속이거나 기만하는 행위를 하지 마세요.",
    },
    {
      icon: (
        <>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <path d="M12.13 11.23l-3.37 3.37a2.2 2.2 0 0 1-3.12 0l-1.92-1.92a2.2 2.2 0 0 1 0-3.12l3.37-3.37a2.2 2.2 0 0 1 3.12 0z" />
          <path d="m15.5 6.5-3 3" />
          <path d="M14 13.5c.333 1 1.333 2.5 3 2.5 1.5 0 2.5-1 2.5-2.5S18 10 16.5 10c-1.5 0-2.5 1.5-2.5 2.5" />
        </>
      ),
      title: "창의적인 탐구",
      description: "AI를 창의력을 확장하고 새로운 아이디어를 탐구하는 긍정적인 도구로 사용하세요."
    },
  ];

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-full" role="region" aria-labelledby="ethics-title">
      <h3 id="ethics-title" className="text-2xl font-bold text-sky-300 mb-6 text-center">
        AI 시나리오 생성기 윤리 가이드
      </h3>
      <div className="flex flex-col space-y-4">
        {ethicsData.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-sky-400 mt-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {item.icon}
              </svg>
            </div>
            <p className="text-gray-300 text-base">
              <strong className="font-semibold text-sky-300">{item.title}:</strong> {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIEthicsGuide;
