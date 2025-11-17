import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { EndingType, CharacterProfile, BackgroundProfile } from '../types';
import { ENDING_DETAILS } from '../constants';

// The AI instance is initialized once using the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Initializes the Gemini service. 
 * This function now exists primarily to be called at startup to ensure the singleton is ready.
 * It no longer takes an apiKey parameter.
 */
export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("Gemini 서비스 설정에 필요한 API 키가 없습니다. 환경 변수를 확인해주세요.");
  }
  // The 'ai' instance is already created at the module level.
  // This function can be used to perform any other setup if needed in the future.
};


const getAiInstance = (): GoogleGenAI => {
  if (!ai) {
    // This case should theoretically not be hit if initializeGemini is called on app start
    throw new Error("Gemini 서비스가 초기화되지 않았습니다.");
  }
  return ai;
};

const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image-preview';

const generateTextWithGemini = async (prompt: string): Promise<string> => {
  let retries = 3;
  while (retries > 0) {
    try {
      const gemini = getAiInstance();
      const response: GenerateContentResponse = await gemini.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      });
      if (!response.text) {
        throw new Error("모델로부터 빈 응답을 받았습니다.");
      }
      return response.text;
    } catch (error) {
      retries--;
      console.error(`Error calling Gemini API for text generation (retries left: ${retries}):`, error);

      // Check for retryable errors (server-side issues)
      if (retries > 0 && error instanceof Error && (error.message.includes('500') || error.message.includes('INTERNAL'))) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries))); // Wait 1s, 2s
        continue; // Try again
      }

      // Handle final failure or non-retryable error
      if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
          throw new Error(`설정된 Gemini API 키가 유효하지 않습니다. 개발자에게 문의하세요.`);
        }
        throw new Error(`Gemini API 텍스트 생성 중 오류 발생: ${error.message}`);
      }
      throw new Error("Gemini API 텍스트 생성 중 알 수 없는 오류 발생");
    }
  }
  // This part is reached if all retries fail
  throw new Error("Gemini API 텍스트 생성 실패: 서버 오류가 반복되었습니다.");
};


// 헬퍼 함수: 연령별 맥락 제공
function getAgeAppropriateContext(age: string) {
  const contexts: Record<string, { description: string; naturalExpression: string; perspective: string }> = {
    '어린이': {
      description: '초등학생',
      naturalExpression: '"초등학생", "어린"',
      perspective: '학교 수업, 부모님과의 대화, 친구들과의 놀이 중심'
    },
    '청소년': {
      description: '중고등학생',
      naturalExpression: '"중학생", "고등학생"',
      perspective: '학교 교육, 미래에 대한 불안, 또래 친구들과의 고민 중심'
    },
    '청년': {
      description: '대학생 또는 사회 초년생',
      naturalExpression: '"대학생", "직장인", "청년"',
      perspective: '진로 고민, 취업 문제, 미래 설계에 대한 불안 중심'
    },
    '중년': {
      description: '40-50대',
      naturalExpression: '"중년의", "40대", "가장"',
      perspective: '자녀 세대의 미래에 대한 걱정, 사회적 책임감 중심'
    },
    '노년': {
      description: '60대 이상',
      naturalExpression: '"은퇴한", "할머니/할아버지", "노인"',
      perspective: '과거와의 비교, 후회, 젊은 세대에 대한 미안함 중심'
    }
  };

  return contexts[age] || contexts['청소년'];
}

export const generatePrologueScenario = async (
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile
): Promise<string> => {
  const ageContext = getAgeAppropriateContext(characterProfile.age);

  const prompt = `
당신은 중고등학생을 위한 교육용 시나리오 작가입니다.
탄소 배출 문제를 주제로 한 게임의 프롤로그를 작성해주세요.

## 교육 목표
학생들이 다음을 이해하도록 해야 합니다:
1. '${coreTheme}' 문제와 탄소 배출의 구체적 인과관계
2. 문제의 조기 경보 신호를 인식하는 능력
3. 일상생활과 환경 문제의 연결성

## 주요 설정

### 게임의 핵심 테마
"${coreTheme}"

**중요**: 이 문제가 발생하게 된 탄소 배출 원인을 프롤로그에서 반드시 설명하세요.
- 탄소 배출 → 환경 변화 → 문제 발생의 인과관계를 중고등학생이 이해할 수 있도록 구체적으로 서술
- 과학적 근거를 간단명료하게 포함 (예: 화석연료 → 온실가스 → 기온상승 → 해수면 상승)

### 주인공 정보
-   ${characterProfile.name ? `이름: "${characterProfile.name}". 이 이름을 시나리오에 자연스럽게 사용해주세요.` : '이름이 정해지지 않았습니다. 이름 없이 서술해주세요.'}
-   연령대: ${characterProfile.age} (${ageContext.description})
-   성별: ${characterProfile.gender}
-   국적: ${characterProfile.nationality}

**캐릭터 표현 지침**:
- 구체적 나이("열다섯 살")보다 ${ageContext.naturalExpression} 같은 자연스러운 표현 사용
- 이 연령대의 관점과 맥락을 반영: ${ageContext.perspective}

### 배경 설정
-   공간: ${background.space}
-   날씨: ${background.weather}
-   시간대: ${background.timeOfDay}
-   분위기: ${background.mood}

이 배경이 탄소 배출 문제로 인해 어떻게 변화했는지 자연스럽게 묘사하세요.

## 프롤로그 작성 지침

### 1. 탄소배출 연관성 (최우선)
- '${coreTheme}' 문제의 **원인**이 탄소 배출임을 명확히 연결
- 구체적 인과관계: 탄소배출 → 온실효과 → 기후변화 → ${coreTheme}
- 과학적이면서도 중고등학생이 이해 가능한 수준

### 2. 전조 증상 묘사
문제가 본격화되기 이전, 다음 신호들이 나타나는 상황 묘사:
- **환경적 신호**: 평소와 다른 기후, 온도, 생태계 변화
- **사회적 신호**: 뉴스 보도, 전문가 경고, 정책 논의
- **일상적 변화**: 캐릭터가 직접 느끼는 변화 (비용 증가, 불편함 등)

### 3. 구조 및 분량
반드시 아래 형식을 따르세요:

**[문단 1]** (150-200자)
- 시간, 장소, 날씨 등 배경 설정
- 핵심 테마 관련 환경 변화 묘사
- 이 변화가 탄소 배출로 인한 것임을 암시하는 내용 포함

**[문단 2]** (150-200자)
- 전조 증상에 대한 캐릭터의 인식과 반응
- 주변 인물과의 대화 (탄소 문제 또는 환경 변화 언급)
- 불안감, 우려, 고민 표현

**[핵심 대사]** (30자 이내, 따옴표로 묶기)
- 긴장감을 높이고 탄소 문제를 환기시키는 한 줄
- 미래에 대한 우려나 질문 형태

### 4. 톤 및 스타일
- 중고등학생 수준에서 이해 가능
- 교육적이면서도 흥미로운 서사
- 과도한 공포 조장 없이 문제의식 전달
- 다음 엔딩으로 이어질 궁금증 유발

### 5. 출력 형식
- 한국어로 작성
- 프롤로그 텍스트만 출력 (다른 설명 없이)
- 총 400자 이내
- 문단 구분은 줄바꿈으로 표시

## 예시 (참고용)

[문단 1]
2035년 여름, 부산 해운대의 백사장은 3년 전보다 50미터나 좁아져 있었다. 중학생 민지는 뉴스에서 들었던 '온실가스로 인한 해수면 상승'이 현실이 되어가는 걸 느꼈다. 에어컨 없는 교실 기온은 42도를 넘었고, 선생님은 '화석연료 사용 감축' 얘기를 또 꺼냈다.

[문단 2]
민지의 아버지는 공장에서 일했지만, 최근 탄소배출 규제로 조업이 줄었다며 한숨을 쉬었다. SNS에는 매일 남태평양 섬나라 침수 영상이 올라왔다. '탄소 배출을 줄이지 않으면 우리도 저렇게 될까?' 민지는 친구에게 물었지만, 아무도 확실한 답을 주지 못했다.

[핵심 대사]
"이대로 가다간... 우리 도시도 바다에 잠길지 몰라."

---

위 지침을 따라 프롤로그를 작성해주세요.
  `;
  return generateTextWithGemini(prompt);
};

export const generateEndingScenario = async (
  prologue: string,
  endingType: EndingType,
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile,
  userSuggestion?: string
): Promise<string> => {
  const endingDetail = ENDING_DETAILS[endingType];
  const prompt = `
당신은 숙련된 게임 시나리오 작가입니다. 아래 제공된 프롤로그와 게임의 핵심 테마에 이어지는 특정 엔딩 시나리오를 작성해주세요.

게임의 핵심 테마: "${coreTheme}"
이 핵심 테마가 엔딩 시나리오 전반에 걸쳐 중요한 배경이자 영향을 미치는 요소로 반영되어야 합니다.

주인공 정보:
-   ${characterProfile.name ? `이름: "${characterProfile.name}". 이 이름을 시나리오에 자연스럽게 사용해주세요.` : '이름이 정해지지 않았습니다. 이름 없이 서술해주세요.'}
-   성별: ${characterProfile.gender}, 나이: ${characterProfile.age}, 국적: ${characterProfile.nationality}, 의상: ${characterProfile.outfit}

기존 프롤로그:
---
${prologue}
---

배경 설정 (이 설정을 시나리오에 자연스럽게 녹여내어 묘사해주세요):
-   공간: ${background.space}
-   날씨: ${background.weather}
-   시간대: ${background.timeOfDay}
-   분위기: ${background.mood}

작성할 엔딩의 상세 내용 (이것이 주요 지시사항입니다):
1.  엔딩 제목: "${endingDetail.title}"
2.  엔딩 지시사항: "${endingDetail.promptInfo}" 

${userSuggestion ? `사용자 추가 구체화 의견: "${userSuggestion}"\n위 엔딩 지시사항에 이 의견을 창의적으로 통합하여 엔딩을 더욱 풍부하게 만들어주세요.` : ''}

요청사항:
-   엔딩은 프롤로그의 내용과 분위기를 자연스럽게 이어받아야 합니다. 프롤로그에서 시작된 사건들이 어떤 과정을 거쳐 이 엔딩에 도달하게 되었는지, 그 인과관계를 설득력 있게 보여주어야 합니다.
-   지정된 엔딩 지시사항과 게임의 핵심 테마, 그리고 사용자의 추가 의견(제공된 경우)을 충실히 반영하여, 그 결과가 만들어내는 상황과 감정을 심도 있게 묘사해주세요.
-   중요: 시나리오 본문에는 '${endingDetail.title}'과 같은 엔딩 제목이나 '성공', '실패' 같은 직접적인 단어를 사용하지 마세요. 상황 묘사를 통해 자연스럽게 엔딩의 분위기를 전달해야 합니다.
-   엔딩은 플레이어에게 깊은 여운을 남기는, 명확하고 완결성 있는 결말을 제공해야 합니다.
-   구조: 반드시 2개의 문단으로 상황을 묘사한 뒤, 마지막에 그 엔딩의 감정을 함축하는 별도의 한 줄짜리 핵심 대사를 추가하여 마무리해주세요. (총 2문단 + 1줄 대사)
-   분량: 전체 글자 수는 400자 이내로 매우 간결하게 작성해주세요.
-   응답은 반드시 한국어로 작성해주세요. 해당 엔딩 시나리오 텍스트만 응답으로 제공해주세요.
  `;
  return generateTextWithGemini(prompt);
};

const translateToEnglish = (profile: CharacterProfile) => {
  const translations = {
    gender: { '남': 'male', '여': 'female' } as Record<string, string>,
    age: { '어린이': 'child', '청소년': 'teenager', '청년': 'young adult', '중년': 'middle-aged adult', '노년': 'elderly person' } as Record<string, string>,
    nationality: { '한국': 'Korean', '유럽': 'European', '아프리카': 'African', '중앙아시아': 'Central Asian' } as Record<string, string>,
    outfit: { '캐쥬얼': 'casual clothes', '후드티': 'a hoodie', '전통의상': 'traditional clothes' } as Record<string, string>,
    artStyle: { '애니메이션': 'anime style', '반실사': 'semi-realistic style', '수채화': 'watercolor painting style', '픽셀아트': 'pixel art style', 'SD캐릭터': 'chibi (SD) style' } as Record<string, string>
  };

  return {
    gender: translations.gender[profile.gender] || profile.gender,
    age: translations.age[profile.age] || profile.age,
    nationality: translations.nationality[profile.nationality] || profile.nationality,
    outfit: translations.outfit[profile.outfit] || profile.outfit,
    artStyle: translations.artStyle[profile.artStyle] || profile.artStyle
  };
};

const translateBackgroundToEnglish = (profile: BackgroundProfile) => {
    const translations = {
        space: { '도시': 'city', '시골': 'countryside', '집': 'house interior', '학교': 'school', '공원': 'park' } as Record<string, string>,
        weather: { '맑음': 'clear sky', '흐림': 'cloudy', '비': 'rainy', '눈': 'snowy', '안개': 'foggy' } as Record<string, string>,
        timeOfDay: { '새벽': 'dawn', '아침': 'morning', '낮': 'daytime', '해질녘': 'sunset', '밤': 'night' } as Record<string, string>,
        mood: { '평화로운': 'peaceful', '활기찬': 'vibrant', '공허한': 'empty, desolate', '긴박한': 'tense, urgent' } as Record<string, string>
    };

    const compositionMap: Record<number, string> = {
        1: 'extreme close-up shot of the character, focusing on face and expression',
        2: 'close-up shot, from the chest up',
        3: 'medium full shot, character from head to toe is visible with some background elements',
        4: 'wide shot, environmental portrait, character is visible but the surrounding environment is emphasized',
        5: 'epic long shot, vast landscape, the character is a small figure in the scenery'
    };

    return {
        space: translations.space[profile.space] || profile.space,
        weather: translations.weather[profile.weather] || profile.weather,
        timeOfDay: translations.timeOfDay[profile.timeOfDay] || profile.timeOfDay,
        mood: translations.mood[profile.mood] || profile.mood,
        composition: compositionMap[profile.composition] || 'medium shot'
    };
};


export const generateImagePromptInternal = async (
  scenarioText: string, 
  scenarioType: 'prologue' | 'ending', 
  characterProfile: CharacterProfile,
  background: BackgroundProfile,
  title?: string
): Promise<string> => {
  const engProfile = translateToEnglish(characterProfile);
  const engBackground = translateBackgroundToEnglish(background);
  
  const characterDescription = `A ${engProfile.age} ${engProfile.nationality} ${engProfile.gender}${characterProfile.name ? ` named ${characterProfile.name}` : ''}, wearing ${engProfile.outfit}.`;
  
  // Safety instruction for clothing
  const safetyInstruction = "The character must be wearing modest, non-revealing, and family-friendly clothing appropriate for their age. Avoid any suggestive or sexualized depiction.";

  const typeText = scenarioType === 'prologue' ? '프롤로그' : `엔딩 (제목: ${title || 'N/A'})`;
  const prologueSpecificInstruction = scenarioType === 'prologue' 
    ? "이 장면은 게임의 핵심 문제가 본격적으로 발생하기 이전의 평화로우면서도 어딘가 불안한 분위기를 담아야 합니다. 캐릭터가 반드시 포함되어야 합니다." 
    : "이 장면은 엔딩의 감정과 상황을 상징적으로 보여주어야 하며, 묘사된 캐릭터가 반드시 포함되어야 합니다. 프롤로그 장면에서 시간이 흐른 후의 모습입니다.";

  const prompt = `
당신은 유능한 프롬프트 엔지니어입니다. 다음 정보를 기반으로 AI 이미지 생성 모델을 위한, 시각적으로 풍부하고 상세한 영어 프롬프트를 작성해주세요.

1.  **캐릭터 정보 (가장 중요, 반드시 반영):**
    -   기본 묘사: "${characterDescription}"
    -   주인공 이름: ${characterProfile.name || '설정되지 않음'}
    -   **안전 지침 (필수 준수):** "${safetyInstruction}"

2.  **그림체:** "${engProfile.artStyle}"

3.  **배경 및 구도 정보 (반드시 반영):**
    -   장소: ${engBackground.space}
    -   날씨와 시간: ${engBackground.weather}, ${engBackground.timeOfDay}
    -   전체적인 분위기: ${engBackground.mood}
    -   카메라 구도: ${engBackground.composition}

4.  **장면 정보:**
    -   시나리오 타입: ${typeText}
    -   한국어 시나리오:
        ---
        ${scenarioText}
        ---

프롬프트 작성 지침:
-   시나리오 내용 중 가장 상징적이고 시각적으로 인상 깊은 **단 한 장면**을 포착하여 묘사하세요.
-   ${prologueSpecificInstruction}
-   **연출 강화 지침 (매우 중요):**
    -   **카메라 워크:** 단순히 정면 구도만 사용하지 말고, 장면의 감정을 극대화할 수 있는 다이나믹한 카메라 앵글(예: low-angle shot, high-angle shot, dutch angle)을 창의적으로 선택하여 적용하세요.
    -   **캐릭터 연기:** 캐릭터가 시나리오의 감정에 몰입하여 특정 행동을 하거나 표정을 짓도록 구체적으로 묘사하세요. (예: 'fist clenched in determination', 'looking at the desolate city with sorrowful eyes').
    -   **색상 및 조명:** 시나리오의 분위기(mood)에 맞춰 전체적인 색상 팔레트와 조명 스타일을 결정하세요. (예: 희망찬 장면은 'vibrant colors, soft golden hour lighting', 절망적인 장면은 'muted, desaturated color palette, dramatic high-contrast lighting').
    -   **배경 디테일:** 장면에 깊이를 더하는 상징적인 보조 요소를 추가하세요. (예: 성공적인 미래 도시에는 'flying vehicles and lush rooftop gardens', 실패한 미래에는 'cracked streets and smog-filled air').
-   위의 **캐릭터 정보, 안전 지침, 그림체, 배경 및 구도 정보**를 모두 조합하여 하나의 완성된 영어 프롬프트를 만드세요.
-   분위기, 배경, 조명(cinematic lighting), 캐릭터의 표정이나 행동을 구체적으로 묘사하세요.
-   최종 프롬프트는 명사와 형용사 위주로 간결하게 구성하고, 불필요한 따옴표나 특수문자는 포함하지 마세요.
-   다른 설명 없이 최종 영어 프롬프트만 제공해주세요.

생성된 영어 이미지 프롬프트:
  `;
  try {
    const gemini = getAiInstance();
    const response: GenerateContentResponse = await gemini.models.generateContent({
      model: textModel, 
      contents: prompt,
      config: {
        temperature: 0.5, 
      }
    });
    
    const text = response.text;
    
    if (!text) {
      console.error("Image prompt generation failed: Model returned no text.", { response });
      const blockReason = response.candidates?.[0]?.finishReason;
      let reason = "모델이 응답을 생성하지 않았습니다.";
      if (blockReason === 'SAFETY') {
        reason = '안전 설정으로 인해 콘텐츠 생성이 차단되었습니다. 캐릭터 설정이나 시나리오를 수정해 보세요.';
      } else if (blockReason) {
        reason += ` (이유: ${blockReason})`;
      }
      throw new Error(reason);
    }
    
    let imagePrompt = text.trim();
    // Clean up potential markdown and unnecessary prefixes
    imagePrompt = imagePrompt.replace(/^(Generated English Image Prompt:|English Image Prompt:|Prompt:)\s*/i, "");
    imagePrompt = imagePrompt.replace(/```(plaintext|text|en|english)?\s*([\s\S]+?)\s*```/,'$2').trim();

    return imagePrompt;
  } catch (error) {
    console.error("Error calling Gemini API for image prompt generation:", error);
     if (error instanceof Error) {
      return Promise.reject(new Error(`Gemini API 이미지 프롬프트 생성 중 오류 발생: ${error.message}`));
    }
    return Promise.reject(new Error("Gemini API 이미지 프롬프트 생성 중 알 수 없는 오류 발생"));
  }
};

export const generateImageFromPrompt = async (
  imagePrompt: string,
  baseImage?: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const gemini = getAiInstance();
    
    // Dynamically build parts for the request
    const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [];
    if (baseImage) {
      parts.push({
        inlineData: {
          data: baseImage.data,
          mimeType: baseImage.mimeType,
        },
      });
    }
    parts.push({ text: imagePrompt });

    const response = await gemini.models.generateContent({
        model: imageModel,
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType: string = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      const reason = textPart?.text ? `모델 응답: ${textPart.text}` : "응답에서 이미지 데이터를 찾을 수 없습니다.";
      return Promise.reject(new Error(`이미지 생성에 실패했습니다. ${reason}`));
    }
  } catch (error)
 {
    console.error("Error calling Gemini API for image generation:", error);
     if (error instanceof Error) {
      return Promise.reject(new Error(`Gemini API 이미지 생성 중 오류 발생: ${error.message}`));
    }
    return Promise.reject(new Error("Gemini API 이미지 생성 중 알 수 없는 오류 발생"));
  }
};