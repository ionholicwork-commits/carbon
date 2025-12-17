
import React, { useState } from 'react';
import { CharacterProfile, ImageState } from '../types';
import { CHARACTER_OPTIONS, OUTFIT_DESCRIPTIONS, OPTION_IMAGES, OPTION_DESCRIPTIONS, NATIONALITY_DETAILS, OCCUPATION_DETAILS, OUTFIT_DETAILS, ART_STYLE_DETAILS, LOADING_TIPS } from '../constants';
import Button from './Button';
import ImageDisplay from './ImageDisplay';
import LoadingOverlay from './LoadingOverlay';
import { generateCharacterPreviewPrompt, generateImageFromPrompt } from '../services/geminiService';

interface CharacterCreatorProps {
  onComplete: (profile: CharacterProfile) => void;
  initialData?: CharacterProfile | null;
  onBack: () => void; // Added onBack prop
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete, initialData, onBack }) => {
  // Determine mode: Wizard (Step-by-step) or Dashboard (Full view)
  const [isWizardMode, setIsWizardMode] = useState(!initialData);
  // Wizard Steps: 0:Identity, 1:Nationality, 2:Occupation, 3:Outfit, 4:ArtStyle
  const [wizardStep, setWizardStep] = useState(0);
  
  // Helper to determine if the initial value is in the preset options or 'custom'
  const getInitialValue = (field: keyof CharacterProfile, options: readonly string[]) => {
    if (!initialData) return options[0];
    const val = initialData[field] as string;
    if (!val) return options[0];
    return options.includes(val) ? val : '기타';
  };

  const getInitialOtherValue = (field: keyof CharacterProfile, options: readonly string[]) => {
    if (!initialData) return '';
    const val = initialData[field] as string;
    if (!val) return '';
    return options.includes(val) ? '' : val;
  };

  const [name, setName] = useState(initialData?.name || '');
  
  const [gender, setGender] = useState(getInitialValue('gender', CHARACTER_OPTIONS.genders));
  
  const [age, setAge] = useState(getInitialValue('age', CHARACTER_OPTIONS.ages));

  const [nationality, setNationality] = useState(getInitialValue('nationality', CHARACTER_OPTIONS.nationalities));
  const [nationalityOther, setNationalityOther] = useState(getInitialOtherValue('nationality', CHARACTER_OPTIONS.nationalities));
  
  const [occupation, setOccupation] = useState(getInitialValue('occupation', CHARACTER_OPTIONS.occupations));
  const [occupationOther, setOccupationOther] = useState(getInitialOtherValue('occupation', CHARACTER_OPTIONS.occupations));

  const [outfit, setOutfit] = useState(getInitialValue('outfit', CHARACTER_OPTIONS.outfits));
  const [outfitOther, setOutfitOther] = useState(getInitialOtherValue('outfit', CHARACTER_OPTIONS.outfits));
  
  const [artStyle, setArtStyle] = useState(getInitialValue('artStyle', CHARACTER_OPTIONS.artStyles));
  const [artStyleOther, setArtStyleOther] = useState(getInitialOtherValue('artStyle', CHARACTER_OPTIONS.artStyles));
  
  const [error, setError] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState<string>('');

  // State for preview image (Dashboard Mode)
  const [previewImage, setPreviewImage] = useState<ImageState>({ 
    isLoading: false, 
    isGenerated: !!initialData?.imageUrl, 
    url: initialData?.imageUrl,
    error: null, 
    skipped: false 
  });

  const getCurrentProfile = (): CharacterProfile => {
    const finalNationality = nationality === '기타' ? nationalityOther : nationality;
    const finalOccupation = occupation === '기타' ? occupationOther : occupation;
    const finalOutfit = outfit === '기타' ? outfitOther : outfit;
    const finalArtStyle = artStyle === '기타' ? artStyleOther : artStyle;

    return {
      name: name.trim() || undefined,
      gender,
      age,
      nationality: finalNationality,
      occupation: finalOccupation,
      outfit: finalOutfit,
      artStyle: finalArtStyle,
      imageUrl: previewImage.url
    };
  };

  const validateProfile = (profile: CharacterProfile): boolean => {
    let errorMsg = null;
    if (nationality === '기타' && !profile.nationality.trim()) errorMsg = "국적을 직접 입력해주세요.";
    else if (occupation === '기타' && !profile.occupation.trim()) errorMsg = "직업을 직접 입력해주세요.";
    else if (outfit === '기타' && !profile.outfit.trim()) errorMsg = "의상 스타일을 직접 입력해주세요.";
    else if (artStyle === '기타' && !profile.artStyle.trim()) errorMsg = "화풍을 직접 입력해주세요.";

    if (errorMsg) {
        setError(errorMsg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }
    return true;
  };

  const handleGeneratePreview = async () => {
    setError(null);
    const profile = getCurrentProfile();
    if (!validateProfile(profile)) return;

    const randomTip = LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
    setLoadingTip(randomTip);

    setPreviewImage(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const prompt = await generateCharacterPreviewPrompt(profile);
      // Use High-Quality model (3rd arg = true)
      // Use Vertical Aspect Ratio '9:16' for Character Preview (4th arg)
      const url = await generateImageFromPrompt(prompt, undefined, true, '9:16');
      setPreviewImage({
        isLoading: false,
        isGenerated: true,
        url: url,
        error: null,
        skipped: false,
        prompt: prompt
      });
    } catch (err) {
       const msg = err instanceof Error ? err.message : "이미지 생성 실패";
       setPreviewImage(prev => ({ ...prev, isLoading: false, error: msg }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const profile = getCurrentProfile();
    if (!validateProfile(profile)) return;
    onComplete(profile);
  };

  // --- WIZARD LOGIC ---

  const handleWizardNext = async () => {
    setError(null);
    
    // Validation for custom inputs in wizard
    let wizError = null;
    if (wizardStep === 1 && nationality === '기타' && !nationalityOther.trim()) wizError = "국적을 입력해주세요.";
    else if (wizardStep === 2 && occupation === '기타' && !occupationOther.trim()) wizError = "직업을 입력해주세요.";
    else if (wizardStep === 3 && outfit === '기타' && !outfitOther.trim()) wizError = "의상을 입력해주세요.";
    else if (wizardStep === 4 && artStyle === '기타' && !artStyleOther.trim()) wizError = "화풍을 입력해주세요.";

    if (wizError) {
        setError(wizError);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (wizardStep < 4) {
        setWizardStep(prev => prev + 1);
    } else {
        // Final Step: Switch to Dashboard Mode FIRST, then generate preview.
        setIsWizardMode(false);
        setTimeout(() => {
            handleGeneratePreview();
        }, 0);
    }
  };

  const handleWizardPrev = () => {
    setError(null);
    if (wizardStep > 0) {
        setWizardStep(prev => prev - 1);
    } else {
        // Wizard step 0 -> Go back to Intro
        onBack();
    }
  };

  const renderWizardStepContent = () => {
    switch (wizardStep) {
        case 0: // Identity
             return (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-left">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">이름 (선택)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="캐릭터의 이름을 지어주세요"
                            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 text-lg"
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">성별</label>
                            <div className="flex gap-2">
                                {CHARACTER_OPTIONS.genders.map(opt => (
                                    <button key={opt} onClick={() => setGender(opt)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${gender === opt ? 'bg-sky-600 text-white ring-2 ring-sky-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        <div className="text-left">
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">나이대</label>
                            <select 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-sky-500"
                            >
                                {CHARACTER_OPTIONS.ages.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
             );
        
        // For steps 1-4, we use a consistent Single Choice layout
        case 1: return renderSingleChoiceGrid(CHARACTER_OPTIONS.nationalities, nationality, setNationality, nationalityOther, setNationalityOther, "국적 선택", "nationality");
        case 2: return renderSingleChoiceGrid(CHARACTER_OPTIONS.occupations, occupation, setOccupation, occupationOther, setOccupationOther, "직업 선택", "occupation");
        case 3: return renderSingleChoiceGrid(CHARACTER_OPTIONS.outfits, outfit, setOutfit, outfitOther, setOutfitOther, "의상 선택", "outfit");
        case 4: return renderSingleChoiceGrid(CHARACTER_OPTIONS.artStyles, artStyle, setArtStyle, artStyleOther, setArtStyleOther, "화풍 선택", "artStyle");
        default: return null;
    }
  };

  // Helper to render a clean grid for single-choice steps with Instant Preview
  const renderSingleChoiceGrid = (
    options: readonly string[], 
    selected: string, 
    setSelected: (v: string) => void, 
    otherValue: string, 
    setOtherValue: (v: string) => void, 
    label: string,
    optionKey: 'nationality' | 'occupation' | 'outfit' | 'artStyle'
  ) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-fade-in">
            {/* Left: Options */}
            <div className="flex flex-col h-full overflow-hidden text-left">
                 <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{label}</label>
                 <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {options.map(opt => (
                        <button 
                            key={opt} 
                            onClick={() => setSelected(opt)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                selected === opt 
                                ? 'bg-sky-600/20 border-sky-500 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                        >
                            <span className="font-semibold text-lg">{opt}</span>
                            {selected === opt && (
                                <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">Selected</span>
                            )}
                        </button>
                    ))}
                    
                    {/* 'Other' Option */}
                    <div className={`w-full rounded-xl border transition-all duration-200 ${
                         selected === '기타'
                         ? 'bg-sky-600/20 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                         : 'bg-gray-800 border-gray-700'
                    }`}>
                        <button 
                            onClick={() => setSelected('기타')}
                            className={`w-full text-left p-4 flex items-center justify-between ${
                                selected === '기타' ? 'text-sky-300' : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <span className="font-semibold text-lg">직접 입력 (기타)</span>
                            {selected === '기타' && (
                                <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">Selected</span>
                            )}
                        </button>
                        {selected === '기타' && (
                             <div className="px-4 pb-4 animate-fade-in">
                                <input
                                    type="text"
                                    value={otherValue}
                                    onChange={(e) => setOtherValue(e.target.value)}
                                    placeholder="직접 입력해주세요"
                                    className="w-full p-3 bg-gray-900 border border-sky-500/50 rounded-lg focus:ring-2 focus:ring-sky-500 text-gray-200"
                                    autoFocus
                                />
                             </div>
                        )}
                    </div>
                 </div>
            </div>

            {/* Right: Preview Panel (Info Card) */}
            <div className="flex flex-col h-full bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden sticky top-0">
                {renderWizardPreview(optionKey, selected)}
            </div>
        </div>
    );
  };

  const renderWizardPreview = (key: 'nationality' | 'occupation' | 'outfit' | 'artStyle', selectedValue: string) => {
      const currentOption = selectedValue;
      
      if (currentOption === '기타') {
           return (
              <div className="h-full flex flex-col justify-center items-center p-8 text-center text-gray-400">
                   <span className="text-6xl mb-6 animate-pulse grayscale opacity-50">
                      ✏️
                   </span>
                   <h3 className="text-2xl font-bold text-white mb-2">사용자 정의 입력</h3>
                   <p className="text-sm">원하는 설정을 직접 입력하여<br/>독창적인 캐릭터를 완성하세요.</p>
              </div>
           );
      }

      // Retrieve the appropriate detail object based on the key
      let detail: { emoji: string; title: string; keywords: string[]; description: string } | undefined;
      
      switch (key) {
        case 'nationality': detail = NATIONALITY_DETAILS[currentOption]; break;
        case 'occupation': detail = OCCUPATION_DETAILS[currentOption]; break;
        case 'outfit': detail = OUTFIT_DETAILS[currentOption]; break;
        case 'artStyle': detail = ART_STYLE_DETAILS[currentOption]; break;
      }
      
      if (!detail) return null;

      return (
        <div className="h-full flex flex-col relative overflow-hidden group bg-gray-900">
             {/* Background Decoration */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80 z-0"></div>
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-900/20 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"></div>

             {/* Card Content */}
             <div className="z-10 flex flex-col h-full p-8 justify-center">
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Big Emoji */}
                    <div className="transform transition-transform duration-500 hover:scale-110 drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]">
                        <span className="text-9xl block filter drop-shadow-2xl select-none">{detail.emoji}</span>
                    </div>
                    
                    {/* Title & Keywords */}
                    <div>
                        <h3 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight mb-4">
                            {detail.title}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {detail.keywords.map(kw => (
                                <span key={kw} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-sky-200 font-medium backdrop-blur-md uppercase tracking-widest shadow-sm">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description at bottom - UPDATED to text-left */}
                <div className="mt-12 pt-8 border-t border-white/10 w-full">
                    <p className="text-gray-300 text-lg leading-relaxed font-light text-left whitespace-pre-line">
                        {detail.description}
                    </p>
                </div>
             </div>
        </div>
      );
  };

  // --- MAIN RENDER ---

  if (isWizardMode) {
    const steps = [
        { title: "기본 정보", sub: "주인공은 누구인가요?" },
        { title: "국적", sub: "어떤 문화적 배경을 가지고 있나요?" },
        { title: "직업", sub: "어떤 역할을 수행하나요?" },
        { title: "의상", sub: "어떤 스타일의 옷을 입고 있나요?" },
        { title: "화풍", sub: "어떤 그림체로 표현할까요?" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
             {/* Wizard Header */}
             <div className="mb-8 flex items-end justify-between border-b border-gray-700 pb-4">
                <div>
                    <span className="text-sky-400 font-bold tracking-widest text-sm uppercase">Character Wizard</span>
                    <h2 className="text-3xl font-extrabold text-white mt-1">{steps[wizardStep].title}</h2>
                    <p className="text-gray-400 mt-1 text-lg">{steps[wizardStep].sub}</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-bold text-gray-600">{wizardStep + 1}</span>
                    <span className="text-xl text-gray-600"> / {steps.length}</span>
                </div>
             </div>
             
             {/* Wizard Content Area */}
             <div className="min-h-[500px] mb-8">
                {renderWizardStepContent()}
             </div>
             
             {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
             )}

             {/* Wizard Navigation */}
             <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <Button 
                    onClick={handleWizardPrev} 
                    variant="secondary" 
                    className="px-8 py-3"
                >
                    {wizardStep === 0 ? "이전 (메인으로)" : "이전 단계"}
                </Button>

                {/* Step Indicators */}
                <div className="flex space-x-2">
                    {steps.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === wizardStep ? 'bg-sky-500 w-8' : idx < wizardStep ? 'bg-gray-500' : 'bg-gray-700'}`}
                        ></div>
                    ))}
                </div>

                <Button 
                    onClick={handleWizardNext} 
                    variant="primary"
                    className="px-8 py-3 shadow-lg shadow-sky-900/20 text-lg"
                >
                    {wizardStep === steps.length - 1 ? "완료 및 미리보기 생성" : "다음 단계"}
                </Button>
             </div>
        </div>
    );
  }

  // --- DASHBOARD MODE RENDER ---

  return (
    <div className="w-full">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
             <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    캐릭터 설정
                    <span className="text-xs font-normal text-gray-500 border border-gray-700 rounded px-2 py-0.5">Dashboard Mode</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">세부적인 설정을 수정하고 실시간으로 미리보기를 확인하세요.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={() => setIsWizardMode(true)} variant="secondary" size="sm">
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    마법사 다시 시작
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="primary" 
                    size="lg"
                    className="shadow-lg shadow-sky-500/20"
                >
                    다음 단계 (완료) →
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INPUT FORM (Span 4) */}
            <div className="xl:col-span-4 space-y-6 order-2 xl:order-1 text-left">
                 <form id="character-creation-form" onSubmit={handleSubmit} className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 backdrop-blur-sm space-y-8">
                    
                    {/* Section 1: Identity */}
                    <section>
                        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            기본 정보 (Identity)
                        </h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">이름</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="이름 입력"
                                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 text-white placeholder-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">성별</label>
                                    <div className="flex rounded-lg bg-gray-900 p-1 border border-gray-600">
                                        {CHARACTER_OPTIONS.genders.map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setGender(opt)}
                                                className={`flex-1 py-2 text-sm rounded-md transition-all whitespace-nowrap ${gender === opt ? 'bg-gray-700 text-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">나이</label>
                                    <select
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full p-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 text-sm"
                                    >
                                        {CHARACTER_OPTIONS.ages.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Background */}
                    <section>
                        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             배경 및 역할 (Background)
                        </h3>
                        <div className="space-y-4">
                            {/* Nationality */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2">국적</label>
                                <div className="flex flex-wrap gap-2">
                                    {CHARACTER_OPTIONS.nationalities.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setNationality(opt)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${nationality === opt ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                    <button
                                         type="button"
                                         onClick={() => setNationality('기타')}
                                         className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${nationality === '기타' ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                                    >
                                        기타
                                    </button>
                                </div>
                                {nationality === '기타' && (
                                    <input
                                        type="text"
                                        value={nationalityOther}
                                        onChange={(e) => setNationalityOther(e.target.value)}
                                        placeholder="국적 입력"
                                        className="mt-2 w-full p-2 bg-gray-900 border border-sky-500/50 rounded text-sm text-white"
                                    />
                                )}
                            </div>

                            {/* Occupation */}
                             <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2">직업</label>
                                <div className="flex flex-wrap gap-2">
                                    {CHARACTER_OPTIONS.occupations.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setOccupation(opt)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${occupation === opt ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                    <button
                                         type="button"
                                         onClick={() => setOccupation('기타')}
                                         className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${occupation === '기타' ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                                    >
                                        기타
                                    </button>
                                </div>
                                {occupation === '기타' && (
                                    <input
                                        type="text"
                                        value={occupationOther}
                                        onChange={(e) => setOccupationOther(e.target.value)}
                                        placeholder="직업 입력"
                                        className="mt-2 w-full p-2 bg-gray-900 border border-sky-500/50 rounded text-sm text-white"
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                     {/* Section 3: Style */}
                     <section>
                        <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                             스타일 (Visual)
                        </h3>
                        <div className="space-y-4">
                            {/* Outfit */}
                             <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2"> 의상</label>
                                <div className="flex flex-wrap gap-2">
                                    {CHARACTER_OPTIONS.outfits.map(opt => (
                                        <div key={opt} className="group relative">
                                            <button
                                                type="button"
                                                onClick={() => setOutfit(opt)}
                                                className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${outfit === opt ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                            >
                                                {opt}
                                            </button>
                                             {/* Tooltip */}
                                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center z-50 border border-gray-700 hidden sm:block">
                                                {OUTFIT_DESCRIPTIONS[opt] || "설명 없음"}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                            </div>
                                        </div>
                                    ))}
                                     <button
                                         type="button"
                                         onClick={() => setOutfit('기타')}
                                         className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${outfit === '기타' ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                                    >
                                        기타
                                    </button>
                                </div>
                                {outfit === '기타' && (
                                    <input
                                        type="text"
                                        value={outfitOther}
                                        onChange={(e) => setOutfitOther(e.target.value)}
                                        placeholder="의상 직접 입력"
                                        className="mt-2 w-full p-2 bg-gray-900 border border-sky-500/50 rounded text-sm text-white"
                                    />
                                )}
                            </div>

                             {/* Art Style */}
                             <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2">화풍</label>
                                <div className="flex flex-wrap gap-2">
                                    {CHARACTER_OPTIONS.artStyles.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setArtStyle(opt)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${artStyle === opt ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                    <button
                                         type="button"
                                         onClick={() => setArtStyle('기타')}
                                         className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${artStyle === '기타' ? 'bg-sky-900/50 border-sky-500 text-sky-200' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                                    >
                                        기타
                                    </button>
                                </div>
                                {artStyle === '기타' && (
                                    <input
                                        type="text"
                                        value={artStyleOther}
                                        onChange={(e) => setArtStyleOther(e.target.value)}
                                        placeholder="화풍 직접 입력"
                                        className="mt-2 w-full p-2 bg-gray-900 border border-sky-500/50 rounded text-sm text-white"
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                 </form>
                 
                 {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">{error}</div>}
            </div>

            {/* RIGHT COLUMN: PREVIEW (Span 8) */}
            <div className="xl:col-span-8 order-1 xl:order-2 sticky top-8">
                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-1 backdrop-blur-sm">
                     <div className="relative bg-black rounded-lg overflow-hidden min-h-[500px] flex items-center justify-center">
                        
                        {previewImage.isGenerated && previewImage.url ? (
                             <ImageDisplay
                                imageUrl={previewImage.url}
                                altText="Character Preview"
                                title="Character Visual Preview"
                                className="w-full h-full"
                                placeholderText=""
                                downloadFileName="character_preview.jpg"
                            />
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-gray-600 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-300 mb-2">캐릭터 외형 미리보기</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    왼쪽의 설정을 변경하고 아래 버튼을 눌러 캐릭터의 모습을 확인해보세요.
                                </p>
                                <Button onClick={handleGeneratePreview} size="lg" className="shadow-xl shadow-sky-500/20">
                                    미리보기 생성하기
                                </Button>
                            </div>
                        )}
                        {/* Moved LoadingOverlay to the end for correct Z-ordering */}
                        <LoadingOverlay isVisible={previewImage.isLoading} message={loadingTip || "캐릭터 외형 생성 중..."} />
                    </div>
                    
                     {/* Quick Action Bar under preview */}
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 border-t border-gray-700 mt-1 rounded-b-lg">
                        <p className="text-xs text-gray-500">
                            * 생성된 이미지는 프롤로그 생성 시 참조됩니다.
                        </p>
                        <Button 
                            onClick={handleGeneratePreview} 
                            disabled={previewImage.isLoading}
                            size="sm"
                            variant="secondary"
                        >
                            {previewImage.isGenerated ? "새로고침 (재생성)" : "미리보기 생성"}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default CharacterCreator;
