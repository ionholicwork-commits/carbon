import React from 'react';

interface ScenarioDisplayProps {
  title?: string;
  text: string | null;
  isLoading?: boolean;
  placeholder?: string;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ title, text, isLoading, placeholder = "시나리오가 여기에 표시됩니다..." }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 min-h-[200px] h-full flex flex-col">
      {title && <h3 className="text-2xl font-bold text-sky-400 mb-6 pb-3 border-b-2 border-gray-700 text-center">{title}</h3>}
      <div className="flex-grow overflow-y-auto max-h-[450px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-400 text-lg">시나리오 생성 중...</div>
          </div>
        ) : text ? (
          <p className="text-gray-300 whitespace-pre-wrap leading-loose text-base">{text}</p>
        ) : (
          <p className="text-gray-500 italic flex justify-center items-center h-full text-base">{placeholder}</p>
        )}
      </div>
    </div>
  );
};

export default ScenarioDisplay;