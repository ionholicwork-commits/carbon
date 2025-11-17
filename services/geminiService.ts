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


export const generatePrologueScenario = async (
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile
): Promise<string> => {
  const prompt = `
당신은 숙련된 게임 시나리오 작가입니다. 탄소 배출 문제를 주제로 한 게임의 프롤로그를 작성해주세요.

주요 설정:
1.  게임의 핵심 테마 (탄소 배출 관련): "${coreTheme}"
2.  주인공 정보:
    -   ${characterProfile.name ? `이름: "${characterProfile.name}". 이 이름을 시나리오에 자연스럽게 사용해주세요.` : '이름이 정해지지 않았습니다. 이름 없이 서술해주세요.'}
    -   성별: ${characterProfile.gender}, 나이: ${characterProfile.age}, 국적: ${characterProfile.nationality}, 의상: ${characterProfile.outfit}

배경 설정 (이 설정을 시나리오에 자연스럽게 녹여내어 묘사해주세요):
-   공간: ${background.space}
-   날씨: ${background.weather}
-   시간대: ${background.timeOfDay}
-   분위기: ${background.mood}

프롤로그 작성 지침:
-   핵심 테마와 관련된 문제가 아직 본격적으로 발생하기 이전, 위험을 감지할 수 있는 전조 증상들이 나타나는 상황을 묘사해주세요.
-   프롤로그는 탄소 배출 문제가 평범한 사람들의 일상에 어떻게 미묘하게 영향을 미치기 시작하는지를 보여주어, 플레이어가 감정적으로 몰입할 수 있도록 해주세요.
-   등장인물이 이러한 전조 증상을 발견하거나, 다른 누군가가 위험에 대해 경고하는 상황을 포함할 수 있습니다.
-   플레이어의 흥미를 유발하고 게임 세계관의 배경과 주요 갈등을 암시해야 합니다.
-   이야기의 결말을 암시하지 말고, 앞으로 벌어질 사건에 대한 궁금증과 긴장감을 증폭시키는 데 집중해주세요.
-   구조: 반드시 2개의 문단으로 상황을 묘사한 뒤, 마지막에 별도의 한 줄짜리 핵심 대사를 추가하여 마무리해주세요. (총 2문단 + 1줄 대사)
-   분량: 전체 글자 수는 400자 이내로 매우 간결하게 작성해주세요.
-   응답은 반드시 한국어로 작성해주세요. 프롤로그 텍스트만 응답으로 제공해주세요.
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