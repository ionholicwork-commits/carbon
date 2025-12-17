
import React from 'react';

const AIEthicsGuide: React.FC = () => {
  
  const ethicsData = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      title: "존중하는 사용",
      description: "타인을 불쾌하게 하거나 차별, 혐오를 조장하는 콘텐츠 생성을 지양합니다. 우리는 모두를 존중하는 윤리적인 AI 사용을 지향합니다.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "책임감 있는 생성",
      description: "AI가 생성한 결과물에 대한 책임은 사용자에게 있습니다. 허위 정보를 유포하거나 악용하지 않도록 주의해주세요.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "정직한 활용",
      description: "AI 생성물을 마치 인간이 직접 창작한 것처럼 속이거나, 타인을 기만하는 용도로 사용해서는 안 됩니다.",
    },
    {
      icon: (
         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
         </svg>
      ),
      title: "창의적인 탐구",
      description: "AI는 여러분의 상상력을 돕는 도구입니다. 탄소 위기라는 주제를 창의적으로 탐구하고 더 나은 미래를 상상하는 데 활용하세요."
    },
  ];

  return (
    <div className="w-full bg-gray-800/40 border border-gray-700 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-md" role="region" aria-labelledby="ethics-title">
      <div className="text-center mb-10">
        <h3 id="ethics-title" className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300 mb-3 tracking-tight">
          인공지능 윤리 가이드
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
            건전하고 안전한 시나리오 생성을 위해 아래 내용을 확인해주세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ethicsData.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:space-x-5 p-6 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-sky-500/30 transition-all duration-300 group">
            <div className="flex-shrink-0 mb-4 sm:mb-0">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sky-900/30 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-sky-300 transition-colors">{item.title}</h4>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIEthicsGuide;
