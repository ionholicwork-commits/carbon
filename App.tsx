import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { EndingContent, AppPage, ImageState, CharacterProfile, BackgroundProfile } from './types';
import { APP_TITLE, INITIAL_ENDING_CONTENT, STEPS, INITIAL_BACKGROUND_PROFILE, ENDING_DEFAULT_BACKGROUNDS } from './constants';
import { 
  initializeGemini,
  generatePrologueScenario, 
  generateEndingScenario, 
  generateImagePromptInternal, 
  generateImageFromPrompt,
} from './services/geminiService';
import Button from './components/Button';
import Alert from './components/Alert';
import ScenarioDisplay from './components/ScenarioDisplay';
import PageLayout from './components/PageLayout';
import ImageDisplay from './components/ImageDisplay';
import CharacterCreator from './components/CharacterCreator';
import BackgroundSelector from './components/BackgroundSelector';
import Stepper from './components/Stepper';
import LoadingOverlay from './components/LoadingOverlay';
import AIEthicsGuide from './components/AIEthicsGuide';
import { validateCoreTheme, validateUserSuggestion } from './utils/validation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.INTRODUCTION);
  const [characterProfile, setCharacterProfile] = useState<CharacterProfile | null>(null);
  
  const [coreTheme, setCoreTheme] = useState<string>('');
  const [background, setBackground] = useState<BackgroundProfile>({ ...INITIAL_BACKGROUND_PROFILE });

  const [prologue, setPrologue] = useState<string>('');
  const [isPrologueGenerated, setIsPrologueGenerated] = useState<boolean>(false);
  const [prologueImage, setPrologueImage] = useState<ImageState>({ isLoading: false, isGenerated: false, error: null, skipped: false });
  
  const [endings, setEndings] = useState<EndingContent[]>(
    INITIAL_ENDING_CONTENT.map(e => ({ ...e, image: { ...e.image } }))
  );
  const [currentEndingIndex, setCurrentEndingIndex] = useState<number>(0);
  const [userEndingSuggestion, setUserEndingSuggestion] = useState<string>(''); 

  const [isLoadingText, setIsLoadingText] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      initializeGemini();
      clearError();
    } catch (err) {
      handleError(err);
    }
  }, []);
  
  const currentStep = useMemo(() => {
    const pageIndex = STEPS.findIndex(step => step.id === currentPage);
    if (pageIndex !== -1) return pageIndex;
    if (currentPage === AppPage.INTRODUCTION) return -1;
    return STEPS.length - 1;
  }, [currentPage]);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    setError(message);
    // Automatically clear the error after 5 seconds for better UX
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const clearError = () => setError(null);
  const clearPrologueImageError = () => setPrologueImage(prev => ({ ...prev, error: null }));
  const clearEndingImageError = (index: number) => {
    setEndings(prev => prev.map((e, i) => i === index ? { ...e, image: { ...e.image, error: null } } : e));
  };
  
  const handleCharacterCreationComplete = (profile: CharacterProfile) => {
    setCharacterProfile(profile);
    navigateToPage(AppPage.PROLOGUE_GENERATION);
  };

  const handleGeneratePrologue = useCallback(async () => {
    if (!coreTheme.trim()) {
      setError("게임의 핵심 테마를 입력해주세요.");
      return;
    }

    // 핵심 테마 검증
    const validationResult = validateCoreTheme(coreTheme);
    if (!validationResult.valid) {
      const errorMessage = validationResult.suggestion
        ? `${validationResult.message}\n\n${validationResult.suggestion}`
        : validationResult.message || "입력값을 확인해주세요.";
      setError(errorMessage);
      return;
    }
    // 경고 메시지가 있는 경우 (valid=true이지만 제안이 있는 경우)
    if (validationResult.message && validationResult.suggestion) {
      console.warn(validationResult.message, validationResult.suggestion);
    }

    if (!characterProfile) {
      handleError(new Error("캐릭터 정보가 설정되지 않았습니다. 앱을 새로고침하여 다시 시도해주세요."));
      return;
    }
    clearError();
    setIsLoadingText(true);
    setPrologue(''); 
    setIsPrologueGenerated(false);
    setPrologueImage({ isLoading: false, isGenerated: false, error: null, skipped: false }); 

    try {
      const scenario = await generatePrologueScenario(coreTheme, characterProfile, background);
      setPrologue(scenario);
      setIsPrologueGenerated(true);
    } catch (err) {
      handleError(err);
      setIsPrologueGenerated(false);
    } finally {
      setIsLoadingText(false);
    }
  }, [coreTheme, characterProfile, background]);

  const handleSkipPrologueImage = () => {
    setPrologueImage(prev => ({ ...prev, skipped: true, error: null }));
  };

  const handleGeneratePrologueImage = useCallback(async () => {
    if (!prologue) {
      setPrologueImage(prev => ({ ...prev, error: "먼저 프롤로그 텍스트를 생성해야 합니다." }));
      return;
    }
    if (!characterProfile) {
      setPrologueImage(prev => ({ ...prev, error: "캐릭터 정보가 설정되지 않았습니다. 앱을 새로고침하여 다시 시도해주세요." }));
      return;
    }
    setPrologueImage({ isLoading: true, isGenerated: false, error: null, url: prologueImage.url, skipped: false }); 
    try {
      const imagePrompt = await generateImagePromptInternal(prologue, 'prologue', characterProfile, background);
      setPrologueImage(prev => ({ ...prev, prompt: imagePrompt }));
      const imageUrl = await generateImageFromPrompt(imagePrompt);
      setPrologueImage(prev => ({ ...prev, url: imageUrl, isGenerated: true, isLoading: false }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "프롤로그 이미지 생성 중 오류 발생";
      handleError(err);
      setPrologueImage(prev => ({ ...prev, error: errorMsg, isLoading: false, isGenerated: prev.url ? true: false })); 
    }
  }, [prologue, prologueImage.url, characterProfile, background]);

  const handleGenerateCurrentEnding = useCallback(async () => {
    if (!prologue) {
      setError("먼저 프롤로그를 생성해야 합니다.");
      return;
    }
    if (!coreTheme.trim()) {
      setError("오류: 게임 핵심 테마가 설정되지 않았습니다. 프롤로그 생성 페이지로 돌아가 테마를 설정해주세요.");
      return;
    }

    // 사용자 추가 의견 검증 (선택적이므로 값이 있을 때만)
    if (userEndingSuggestion && userEndingSuggestion.trim()) {
      const validationResult = validateUserSuggestion(userEndingSuggestion);
      if (!validationResult.valid) {
        const errorMessage = validationResult.suggestion
          ? `${validationResult.message}\n\n${validationResult.suggestion}`
          : validationResult.message || "입력값을 확인해주세요.";
        setError(errorMessage);
        return;
      }
      // 경고 메시지가 있는 경우 (valid=true이지만 제안이 있는 경우)
      if (validationResult.message && validationResult.suggestion) {
        console.warn(validationResult.message, validationResult.suggestion);
      }
    }

    if (!characterProfile) {
      handleError(new Error("캐릭터 정보가 설정되지 않았습니다. 앱을 새로고침하여 다시 시도해주세요."));
      return;
    }
    clearError();
    setIsLoadingText(true);
    const currentEndingType = endings[currentEndingIndex].type;
    
    setEndings(prev => prev.map((e, i) => 
      i === currentEndingIndex ? { ...e, scenario: '', isGenerated: false, image: { isLoading: false, isGenerated: false, error: null, skipped: false } } : e
    ));

    try {
      const scenario = await generateEndingScenario(prologue, currentEndingType, coreTheme, characterProfile, background, userEndingSuggestion);
      setEndings(prevEndings => 
        prevEndings.map((ending, index) => 
          index === currentEndingIndex ? { ...ending, scenario, isGenerated: true } : ending
        )
      );
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoadingText(false);
    }
  }, [prologue, currentEndingIndex, endings, coreTheme, characterProfile, userEndingSuggestion, background]); 

  const handleSkipCurrentEndingImage = () => {
    setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, skipped: true, error: null } } : e
    ));
  };

  const handleGenerateCurrentEndingImage = useCallback(async () => {
    const currentEnding = endings[currentEndingIndex];
    if (!currentEnding || !currentEnding.scenario) {
      setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, error: "먼저 엔딩 텍스트를 생성해야 합니다." } } : e
      ));
      return;
    }
    if (!characterProfile) {
       setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, error: "캐릭터 정보가 없습니다. 앱을 새로고침하여 다시 시작해주세요." } } : e
      ));
      return;
    }

    setEndings(prev => prev.map((e, i) => 
      i === currentEndingIndex ? { ...e, image: { ...e.image, isLoading: true, isGenerated: false, error: null, url: e.image.url, skipped: false } } : e
    ));

    try {
      const imagePrompt = await generateImagePromptInternal(currentEnding.scenario, 'ending', characterProfile, background, currentEnding.title);
      setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, prompt: imagePrompt } } : e
      ));

      const prologueImageUrl = prologueImage.url;
      let baseImageForEnding;
      if (prologueImageUrl) {
          const match = prologueImageUrl.match(/^data:(.*?);base64,(.*)$/);
          if (match && match[1] && match[2]) {
              const mimeType = match[1];
              const data = match[2];
              baseImageForEnding = { data, mimeType };
          }
      }

      const imageUrl = await generateImageFromPrompt(imagePrompt, baseImageForEnding);
      setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, url: imageUrl, isGenerated: true, isLoading: false } } : e
      ));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : `${currentEnding.title} 엔딩 이미지 생성 중 오류 발생`;
      handleError(err);
       setEndings(prev => prev.map((e, i) => 
        i === currentEndingIndex ? { ...e, image: { ...e.image, error: errorMsg, isLoading: false, isGenerated: e.image.url ? true : false } } : e
      ));
    }
  }, [endings, currentEndingIndex, characterProfile, prologueImage.url, background]);


  const navigateToPage = (page: AppPage) => {
    clearError();
    setCurrentPage(page);
  };
  
  const resetFullScenario = () => {
    setCharacterProfile(null);
    setCoreTheme('');
    setBackground({ ...INITIAL_BACKGROUND_PROFILE });
    setPrologue('');
    setIsPrologueGenerated(false);
    setPrologueImage({ isLoading: false, isGenerated: false, error: null, skipped: false });
    setEndings(INITIAL_ENDING_CONTENT.map(e => ({ ...e, image: { ...e.image } }))); 
    setCurrentEndingIndex(0);
    setUserEndingSuggestion(''); 
    navigateToPage(AppPage.INTRODUCTION);
  };

  const navigateToFirstEnding = () => {
    const firstEndingType = endings[0].type;
    const defaultBackground = ENDING_DEFAULT_BACKGROUNDS[firstEndingType];
    setBackground(prev => ({
      ...defaultBackground,
      space: prev.space, // 프롤로그에서 설정된 공간 유지
    }));
    navigateToPage(AppPage.ENDING_GENERATION);
  };

  const handleNextEnding = () => {
    if (currentEndingIndex < endings.length - 1) {
      const nextIndex = currentEndingIndex + 1;
      const nextEndingType = endings[nextIndex].type;
      const defaultBackground = ENDING_DEFAULT_BACKGROUNDS[nextEndingType];
      
      setBackground(prev => ({
        ...defaultBackground,
        space: prev.space, // 이전 엔딩의 공간 설정 유지
      }));
      
      setCurrentEndingIndex(nextIndex);
      setUserEndingSuggestion('');
      clearError();
    }
  };

  const handlePrevious = () => {
    clearError();
    if (currentPage === AppPage.PROLOGUE_GENERATION) {
      navigateToPage(AppPage.CHARACTER_CREATION);
    } else if (currentPage === AppPage.ENDING_GENERATION) {
      if (currentEndingIndex > 0) {
        const prevIndex = currentEndingIndex - 1;
        const prevEndingType = endings[prevIndex].type;
        const defaultBackground = ENDING_DEFAULT_BACKGROUNDS[prevEndingType];

        setBackground(prev => ({
            ...defaultBackground,
            space: prev.space,
        }));
        setCurrentEndingIndex(prevIndex);
        setUserEndingSuggestion(''); 
      } else {
        navigateToPage(AppPage.PROLOGUE_GENERATION);
      }
    }
  };


  const handleDownloadExcel = () => {
    const placeholderText = "생성되지 않았습니다.";
    const data = [
      ["번호", "시나리오 내용"],
      ["1", prologue || placeholderText], 
      ...endings.map((ending, index) => [
        (index + 2).toString(), 
        ending.scenario || placeholderText
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const columnWidths = [
        { wch: 10 }, 
        { wch: 100 } 
    ];
    worksheet['!cols'] = columnWidths;
    
    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { 
        const cell_address = {c:1, r:R}; 
        const cell = worksheet[XLSX.utils.encode_cell(cell_address)];
        if (cell && cell.v && typeof cell.v === 'string') {
            if (!cell.s) cell.s = {};
            cell.s.wrapText = true; 
        }
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "시나리오");
    XLSX.writeFile(workbook, "탄소_위기_시나리오.xlsx");
  };

  const renderContent = () => {
    const currentEnding = endings[currentEndingIndex];
    const currentEndingImage = currentEnding?.image;
    const isProcessing = isLoadingText || prologueImage.isLoading || (currentEndingImage?.isLoading ?? false);

    switch (currentPage) {
      case AppPage.INTRODUCTION:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-sky-300">탄소 배출 테마의 게임 시나리오 생성기</h2>
            <p className="text-lg text-gray-300">
              탄소 배출 문제를 주제로 한 독창적인 게임 시나리오를 생성하세요.<br />
              여러분이 탐색한 탄소 배출로 예상되는 핵심 문제 1가지를 선택하여 작성하면<br />
              AI가 멋진 시나리오를 만들어 드릴게요!
            </p>
            <div className="my-8">
              <AIEthicsGuide />
            </div>
            <Button 
              onClick={() => navigateToPage(AppPage.CHARACTER_CREATION)}
              size="lg"
              className="w-full sm:w-auto mt-4"
            >
              캐릭터 만들고 시작하기
            </Button>
          </div>
        );

      case AppPage.CHARACTER_CREATION:
        return <CharacterCreator onComplete={handleCharacterCreationComplete} />;

      case AppPage.PROLOGUE_GENERATION:
      case AppPage.ENDING_GENERATION:
        const isProloguePage = currentPage === AppPage.PROLOGUE_GENERATION;
        const targetText = isProloguePage ? prologue : currentEnding?.scenario;
        const targetImage = isProloguePage ? prologueImage : currentEndingImage;
        const isTextGenerated = isProloguePage ? isPrologueGenerated : currentEnding?.isGenerated;
        const isNextButtonDisabled = isProcessing || !isTextGenerated || !(targetImage?.isGenerated || targetImage?.url || targetImage?.skipped);
        
        const getBackButtonText = () => {
          if (isProloguePage) return '캐릭터 수정';
          if (currentEndingIndex > 0) return '이전 엔딩으로';
          return '프롤로그로';
        };

        return (
          <div>
            {/* Top Section: Controls (Left) and Image (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Controls */}
              <div className="flex flex-col space-y-6 h-full">
                <div className="space-y-6">
                  {isProloguePage ? (
                    <>
                      <h3 className="text-lg font-semibold text-sky-200 border-b border-gray-700 pb-2">1단계: 프롤로그 작성</h3>
                      <div>
                        <label htmlFor="coreTheme" className="block text-sm font-medium text-sky-300 mb-1">게임 핵심 테마 (탄소배출 관련 문제)</label>
                        <textarea id="coreTheme" value={coreTheme} onChange={(e) => setCoreTheme(e.target.value)} placeholder="예: 해수면 상승으로 인한 도시 침몰" rows={3} disabled={isProcessing} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-gray-500" />
                      </div>
                      <BackgroundSelector profile={background} onChange={setBackground} isProcessing={isProcessing} />
                    </>
                  ) : (
                    <>
                       <h3 className="text-lg font-semibold text-sky-200 border-b border-gray-700 pb-2">1단계: 엔딩 작성</h3>
                      <div className="p-4 bg-gray-700 rounded-md">
                        <h3 className="text-lg font-semibold text-sky-300">현재 엔딩 주제: {currentEnding.title}</h3>
                        <p className="text-gray-300">{currentEnding.description}</p>
                      </div>
                      <div>
                        <label htmlFor="userEndingSuggestion" className="block text-sm font-medium text-sky-300 mb-1">(선택) 구체적인 아이디어를 추가해보세요</label>
                        <textarea id="userEndingSuggestion" value={userEndingSuggestion} onChange={(e) => setUserEndingSuggestion(e.target.value)} placeholder="예: 특정 기술의 발전, 예상치 못한 사회적 변화" rows={3} disabled={isProcessing} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-gray-500" />
                      </div>
                       <BackgroundSelector profile={background} onChange={setBackground} isProcessing={isProcessing} />
                    </>
                  )}
                </div>
                <div className="mt-auto pt-6 flex items-center h-[72px]">
                  {isProloguePage ? (
                     <Button onClick={handleGeneratePrologue} isLoading={isLoadingText} disabled={isProcessing || !coreTheme.trim()} className="w-full">
                        {isPrologueGenerated ? "프롤로그 재생성" : "프롤로그 생성"}
                      </Button>
                  ) : (
                     <Button onClick={handleGenerateCurrentEnding} isLoading={isLoadingText} disabled={isProcessing || !prologue} className="w-full">
                        {currentEnding.isGenerated ? `${currentEnding.title} 재생성` : `${currentEnding.title} 생성`}
                      </Button>
                  )}
                </div>
              </div>
              
              {/* Right Column: Image and Image Controls */}
              <div className="relative flex flex-col h-full">
                 <div className="flex-grow flex items-center justify-center">
                    <LoadingOverlay isVisible={targetImage?.isLoading ?? false} />
                    <ImageDisplay
                      imageUrl={targetImage?.url}
                      altText="생성된 이미지"
                      placeholderText={
                        isTextGenerated
                          ? (targetImage?.skipped ? "이미지 생성을 건너뛰었습니다." : "이미지 생성 버튼을 눌러주세요.")
                          : "먼저 시나리오를 생성해주세요."
                      }
                    />
                 </div>
                <div className="mt-auto pt-6 h-[158px]">
                  {targetImage?.error && <Alert message={targetImage.error} type="error" onClose={isProloguePage ? clearPrologueImageError : () => clearEndingImageError(currentEndingIndex)} className="mb-2" />}
                  
                  {isTextGenerated && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-sky-200 border-b border-gray-700 pb-2 text-center">2단계: 이미지 생성</h3>
                      <div className="space-y-2">
                        <Button onClick={isProloguePage ? handleGeneratePrologueImage : handleGenerateCurrentEndingImage} isLoading={targetImage?.isLoading} disabled={isProcessing} className="w-full">
                          {targetImage?.isGenerated || targetImage?.url ? "이미지 재생성" : "이미지 생성"}
                        </Button>
                        {!targetImage?.isGenerated && !targetImage?.url && !targetImage?.isLoading && !targetImage?.skipped && (
                          <Button onClick={isProloguePage ? handleSkipPrologueImage : handleSkipCurrentEndingImage} variant="secondary" disabled={isProcessing} className="w-full">
                            이미지 생성 건너뛰기
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Scenario Text */}
            <div className="mt-8">
              <ScenarioDisplay 
                title={isProloguePage ? "프롤로그" : `${currentEnding.title}`}
                text={targetText}
                isLoading={isLoadingText && !isTextGenerated}
              />
            </div>

            {/* Page Navigation Bar */}
            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
              {/* Back Button */}
              <Button 
                onClick={handlePrevious}
                variant="secondary" 
                disabled={isProcessing}
              >
                {getBackButtonText()}
              </Button>

              {/* Next/Finish Button */}
              {isProloguePage ? (
                <Button onClick={navigateToFirstEnding} disabled={isNextButtonDisabled} variant="primary" size="lg">
                  엔딩 작성 시작
                </Button>
              ) : (
                currentEndingIndex < endings.length - 1 ? (
                  <Button onClick={handleNextEnding} disabled={isNextButtonDisabled}>
                    다음 엔딩 ({endings[currentEndingIndex + 1].title})
                  </Button>
                ) : (
                  <Button onClick={() => navigateToPage(AppPage.FULL_SCENARIO)} disabled={isNextButtonDisabled} size="lg" variant="primary">
                    완성된 시나리오 보기
                  </Button>
                )
              )}
            </div>
          </div>
        );

      case AppPage.FULL_SCENARIO:
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-sky-400 mb-2">게임 핵심 테마</h2>
              <p className="text-gray-300 bg-gray-700 p-3 rounded-md mb-6">{coreTheme || "핵심 테마가 설정되지 않았습니다."}</p>
              <ScenarioDisplay title="프롤로그" text={prologue} placeholder="프롤로그가 생성되지 않았습니다." />
              {(prologueImage.isGenerated || prologueImage.url) && prologueImage.url && <ImageDisplay imageUrl={prologueImage.url} altText="프롤로그 이미지" className="mt-4" title="프롤로그 이미지" downloadFileName="1_prologue.jpg" />}
              {prologueImage.error && !prologueImage.url && <Alert message={`프롤로그 이미지 생성 실패: ${prologueImage.error}`} type="error" className="mt-2"/>}
            </div>
            
            {endings.map((ending, index) => (
              <div key={ending.type}>
                <ScenarioDisplay title={`${index + 1}. ${ending.title}`} text={ending.scenario} placeholder={`${ending.title} 엔딩이 생성되지 않았습니다.`} />
                 <p className="mt-2 text-sm text-gray-400">주제: {ending.description}</p>
                {(ending.image.isGenerated || ending.image.url) && ending.image.url && <ImageDisplay imageUrl={ending.image.url} altText={`${ending.title} 이미지`} className="mt-4" title = {`${ending.title} 이미지`} downloadFileName={`${index + 2}_${ending.type}.jpg`} />}
                {ending.image.error && !ending.image.url && <Alert message={`${ending.title} 이미지 생성 실패: ${ending.image.error}`} type="error" className="mt-2"/>}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
              <Button onClick={resetFullScenario} size="lg">새 시나리오 작성</Button>
              <Button onClick={handleDownloadExcel} size="lg" variant="primary">시나리오 Excel 다운로드</Button>
            </div>
          </div>
        );
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  const pageTitle = STEPS.find(s => s.id === currentPage)?.name || APP_TITLE;

  return (
    <PageLayout 
      title={currentPage === AppPage.INTRODUCTION ? APP_TITLE : pageTitle}
      showStepper={currentPage !== AppPage.INTRODUCTION}
      stepperProps={{ steps: STEPS, currentStep: currentStep }}
      fullWidth={currentPage === AppPage.FULL_SCENARIO}
    >
      <div className="w-full">
        {error && <Alert message={error} type="error" onClose={clearError} className="mb-6"/>}
        {renderContent()}
      </div>
    </PageLayout>
  );
};

export default App;