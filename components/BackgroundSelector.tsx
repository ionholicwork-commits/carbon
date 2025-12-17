
import React, { useState } from 'react';
import { BackgroundProfile } from '../types';
import { BACKGROUND_OPTIONS } from '../constants';

interface BackgroundSelectorProps {
  profile: BackgroundProfile;
  onChange: (newProfile: BackgroundProfile) => void;
  isProcessing: boolean;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ profile, onChange, isProcessing }) => {
  const [customInputs, setCustomInputs] = useState({
    space: '',
    weather: '',
    mood: ''
  });

  const handleOptionChange = (
    field: keyof BackgroundProfile,
    value: string,
  ) => {
    onChange({ ...profile, [field]: value });
  };

  const handleCustomInputChange = (
    field: 'space' | 'weather' | 'mood',
    value: string
  ) => {
    setCustomInputs(prev => ({ ...prev, [field]: value }));
    onChange({ ...profile, [field]: value });
  };

  const renderOptionGroup = (
    label: string,
    field: 'space' | 'weather' | 'mood' | 'timeOfDay',
    options: readonly string[]
  ) => {
    const currentValue = profile[field] as string;
    const isCustom = !options.includes(currentValue);

    return (
      <div className="py-5 first:pt-0 last:pb-0">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50"></span>
            {label}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionChange(field, option)}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 border ${
                currentValue === option 
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.2)]' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          ))}
          
          {field !== 'timeOfDay' && (
             <button
              type="button"
              onClick={() => {
                  const restoredValue = customInputs[field as 'space'|'weather'|'mood'] || '';
                  onChange({ ...profile, [field]: restoredValue });
              }}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 border ${
                isCustom 
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.2)]' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              직접 입력
            </button>
          )}
        </div>
        
        {field !== 'timeOfDay' && isCustom && (
          <div className="mt-3 animate-fade-in">
             <input
              type="text"
              value={customInputs[field as 'space'|'weather'|'mood']}
              onChange={(e) => handleCustomInputChange(field as 'space'|'weather'|'mood', e.target.value)}
              placeholder={`${label} 직접 입력`}
              className="w-full px-4 py-2 bg-gray-900 border border-sky-500/50 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-200 text-sm placeholder-gray-600 transition-all"
              disabled={isProcessing}
              autoFocus
              required
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur-sm px-5 py-2 divide-y divide-gray-700/50">
      {renderOptionGroup('공간 (Location)', 'space', BACKGROUND_OPTIONS.spaces)}
      
      <div className="py-5">
         <div className="grid grid-cols-1 gap-6">
            <div>
               {renderOptionGroup('날씨 (Weather)', 'weather', BACKGROUND_OPTIONS.weathers)}
            </div>
            <div>
               {renderOptionGroup('시간대 (Time)', 'timeOfDay', BACKGROUND_OPTIONS.timeOfDays)}
            </div>
         </div>
      </div>

      {renderOptionGroup('분위기 (Mood)', 'mood', BACKGROUND_OPTIONS.moods)}
      
      <div className="py-5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
            카메라 구도 (Composition)
        </label>
        <div className="flex p-1 bg-gray-900/50 rounded-lg border border-gray-700/50">
            {BACKGROUND_OPTIONS.compositions.map((label) => {
                return (
                    <button
                        key={label}
                        type="button"
                        onClick={() => onChange({ ...profile, composition: label })}
                        disabled={isProcessing}
                        className={`flex-1 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200 ${
                          profile.composition === label
                          ? 'bg-gray-700 text-sky-300 shadow-sm ring-1 ring-gray-600' 
                          : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
