import React from 'react';

interface ScenarioDisplayProps {
  title?: string;
  text: string | null;
  isLoading?: boolean;
  placeholder?: string;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ title, text, isLoading, placeholder = "시나리오가 여기에 표시됩니다..." }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl min-h-[200px] h-full flex flex-col">
      {title && <h3 className="text-xl font-semibold text-sky-400 mb-4 text-center">{title}</h3>}
      <div className="flex-grow overflow-y-auto max-h-[450px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-400">시나리오 생성 중...</div>
          </div>
        ) : text ? (
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>
        ) : (
          <p className="text-gray-500 italic flex justify-center items-center h-full">{placeholder}</p>
        )}
      </div>
    </div>
  );
};

export default ScenarioDisplay;