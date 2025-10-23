import React, { useState } from 'react';
import { BackgroundProfile } from '../types';
import { BACKGROUND_OPTIONS } from '../constants';

interface BackgroundSelectorProps {
  profile: BackgroundProfile;
  onChange: (newProfile: BackgroundProfile) => void;
  isProcessing: boolean;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ profile, onChange, isProcessing }) => {
  const [spaceOther, setSpaceOther] = useState('');
  const [weatherOther, setWeatherOther] = useState('');
  const [moodOther, setMoodOther] = useState('');

  const handleSimpleChange = (field: keyof BackgroundProfile, value: string | number) => {
    onChange({ ...profile, [field]: value });
  };

  const handleOptionChange = (
    field: 'space' | 'weather' | 'mood',
    value: string,
    options: readonly string[],
    setOtherState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (options.includes(value) || value === '기타') {
      if (value !== '기타') {
        setOtherState('');
      }
      onChange({ ...profile, [field]: value });
    }
  };

  const handleOtherInputChange = (
    field: 'space' | 'weather' | 'mood',
    value: string,
    setOtherState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setOtherState(value);
    onChange({ ...profile, [field]: value });
  };
  
  const renderRadioGroup = (
    label: string,
    field: 'space' | 'weather' | 'mood' | 'timeOfDay',
    options: readonly string[],
    selectedValue: string,
    otherValue?: string,
    setOtherState?: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div>
      <label className="block text-sm font-medium text-sky-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (field === 'timeOfDay') {
                 handleSimpleChange(field, option)
              } else {
                 handleOptionChange(field as 'space' | 'weather' | 'mood', option, options, setOtherState!)
              }
            }}
            disabled={isProcessing}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${selectedValue === option ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {option}
          </button>
        ))}
        {setOtherState && (
          <button
            type="button"
            onClick={() => handleOptionChange(field as 'space' | 'weather' | 'mood', '기타', options, setOtherState)}
            disabled={isProcessing}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${selectedValue === '기타' || !options.includes(selectedValue) ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            기타
          </button>
        )}
      </div>
      {(selectedValue === '기타' || (setOtherState && !options.includes(selectedValue))) && setOtherState && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => handleOtherInputChange(field as 'space' | 'weather' | 'mood', e.target.value, setOtherState)}
          placeholder={`${label} 직접 입력`}
          className="mt-3 w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-200"
          disabled={isProcessing}
          required
        />
      )}
    </div>
  );
  
    const compositionLabels = ['인물 중심', '클로즈업', '중간', '와이드', '배경 중심'];


  return (
    <fieldset className="border border-gray-700 p-4 rounded-lg space-y-4" disabled={isProcessing}>
      <legend className="text-lg font-medium text-sky-300 px-2">배경 설정</legend>
      {renderRadioGroup('공간', 'space', BACKGROUND_OPTIONS.spaces, profile.space, spaceOther, setSpaceOther)}
      {renderRadioGroup('날씨', 'weather', BACKGROUND_OPTIONS.weathers, profile.weather, weatherOther, setWeatherOther)}
      {renderRadioGroup('시간대', 'timeOfDay', BACKGROUND_OPTIONS.timeOfDays, profile.timeOfDay)}
      {renderRadioGroup('분위기', 'mood', BACKGROUND_OPTIONS.moods, profile.mood, moodOther, setMoodOther)}
      <div>
        <label className="block text-sm font-medium text-sky-300 mb-2">구도</label>
        <div className="flex justify-between items-center bg-gray-700 rounded-lg p-2">
            {compositionLabels.map((label, index) => {
                const value = index + 1;
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleSimpleChange('composition', value)}
                        disabled={isProcessing}
                        className={`w-1/5 text-center text-xs sm:text-sm py-1.5 rounded transition-colors disabled:opacity-50 ${profile.composition === value ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-gray-600'}`}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
      </div>
    </fieldset>
  );
};

export default BackgroundSelector;
