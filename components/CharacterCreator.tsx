import React, { useState } from 'react';
import { CharacterProfile } from '../types';
import { CHARACTER_OPTIONS } from '../constants';
import Button from './Button';

interface CharacterCreatorProps {
  onComplete: (profile: CharacterProfile) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(CHARACTER_OPTIONS.genders[0]);
  const [age, setAge] = useState(CHARACTER_OPTIONS.ages[1]); // Default to 청소년
  const [nationality, setNationality] = useState(CHARACTER_OPTIONS.nationalities[0]);
  const [nationalityOther, setNationalityOther] = useState('');
  const [outfit, setOutfit] = useState(CHARACTER_OPTIONS.outfits[0]);
  const [outfitOther, setOutfitOther] = useState('');
  const [artStyle, setArtStyle] = useState(CHARACTER_OPTIONS.artStyles[0]);
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalNationality = nationality === '기타' ? nationalityOther : nationality;
    const finalOutfit = outfit === '기타' ? outfitOther : outfit;
    
    if ((nationality === '기타' && !finalNationality.trim()) || (outfit === '기타' && !finalOutfit.trim())) {
      setError("'기타' 항목을 선택한 경우, 직접 내용을 입력해야 합니다.");
      return;
    }

    onComplete({
      name: name.trim() || undefined,
      gender,
      age,
      nationality: finalNationality,
      outfit: finalOutfit,
      artStyle,
    });
  };
  
  const renderRadioGroup = (
    label: string,
    name: string,
    options: readonly string[],
    selectedValue: string,
    onChange: (value: string) => void,
    otherValue?: string,
    onOtherChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <fieldset className="border border-gray-700 p-4 rounded-lg">
      <legend className="text-lg font-medium text-sky-300 px-2">{label}</legend>
      <div className="flex flex-wrap gap-2 pt-2">
        {options.map(option => (
          <label key={option} className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${selectedValue === option ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <input type="radio" name={name} value={option} checked={selectedValue === option} onChange={() => onChange(option)} className="hidden" />
            {option}
          </label>
        ))}
        {onOtherChange && (
           <label className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${selectedValue === '기타' ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>
             <input type="radio" name={name} value="기타" checked={selectedValue === '기타'} onChange={() => onChange('기타')} className="hidden" />
             기타
           </label>
        )}
      </div>
      {selectedValue === '기타' && onOtherChange && (
        <input
          type="text"
          value={otherValue}
          onChange={onOtherChange}
          placeholder={`${label} 직접 입력`}
          className="mt-3 w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-200"
          required
        />
      )}
    </fieldset>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-center text-gray-300">
        시나리오에 등장할 주인공의 모습을 설정해주세요.
        <br />
        여기서 설정한 모습이 모든 이미지에 일관되게 적용됩니다.
      </p>
      
      <fieldset className="border border-gray-700 p-4 rounded-lg">
        <legend className="text-lg font-medium text-sky-300 px-2">주인공 이름 (선택)</legend>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하면 시나리오에 반영됩니다."
          className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-gray-500"
        />
      </fieldset>

      {renderRadioGroup('성별', 'gender', CHARACTER_OPTIONS.genders, gender, setGender)}
      {renderRadioGroup('나이', 'age', CHARACTER_OPTIONS.ages, age, setAge)}
      {renderRadioGroup('국적', 'nationality', CHARACTER_OPTIONS.nationalities, nationality, setNationality, nationalityOther, (e) => setNationalityOther(e.target.value))}
      {renderRadioGroup('의상', 'outfit', CHARACTER_OPTIONS.outfits, outfit, setOutfit, outfitOther, (e) => setOutfitOther(e.target.value))}
      {renderRadioGroup('그림체', 'artStyle', CHARACTER_OPTIONS.artStyles, artStyle, setArtStyle)}
      
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      
      <Button type="submit" size="lg" className="w-full !mt-8">
        설정 완료하고 프롤로그 작성 시작
      </Button>
    </form>
  );
};

export default CharacterCreator;