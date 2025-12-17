
import React from 'react';

interface ScenarioDisplayProps {
  title?: string;
  text: string | null;
  isLoading?: boolean;
  placeholder?: string;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ title, text, isLoading, placeholder = "시나리오가 여기에 표시됩니다..." }) => {
  return (
    <div className="flex flex-col h-full min-h-[300px] bg-gray-900/80 border border-gray-700 rounded-xl shadow-inner overflow-hidden relative group">
      {title && (
        <div className="bg-gray-800/90 px-4 py-3 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            {title}
          </h3>
          {text && !isLoading && (
             <span className="text-xs text-gray-500 font-mono">READ_ONLY_MODE</span>
          )}
        </div>
      )}
      
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow h-full text-gray-500 space-y-3">
            <div className="flex space-x-1">
               <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-150"></div>
               <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="text-sm font-mono animate-pulse text-center">Writing scenario data...</p>
          </div>
        ) : text ? (
          <div className="prose prose-invert max-w-none">
             <p className="text-gray-200 whitespace-pre-wrap leading-loose text-base sm:text-lg font-light tracking-wide animate-fade-in">
              {text}
             </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow h-full text-gray-600 opacity-50">
            <svg className="w-12 h-12 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm font-medium text-center">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioDisplay;
