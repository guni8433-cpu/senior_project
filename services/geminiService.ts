import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ScriptTopic, GeneratedScript } from "../types";

// Helper to get API Key from localStorage or sessionStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem('GEMINI_API_KEY') || sessionStorage.getItem('GEMINI_API_KEY_TEMP');
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('GEMINI_API_KEY', apiKey);
};

// Helper to get AI instance
const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key가 설정되지 않았습니다.');
  }
  return new GoogleGenAI({ apiKey });
};

// System instruction for the Persona
const SYSTEM_INSTRUCTION = `
당신은 대한민국 최고의 시니어 전문 방송 작가이자 유튜브 기획자입니다.
60대 이상 시청자들의 심리(고독, 가족애, 건강, 재산 문제, 과거의 향수)를 완벽하게 이해하고 있습니다.
'사랑과 전쟁', '전원일기', 그리고 최근 인기 있는 시니어 유튜브 스토리텔링 채널들의 흥행 공식을 꿰뚫고 있습니다.
자극적이지만 공감 가고, 눈물 쏙 빼는 감동과 사이다 같은 반전을 자유자재로 구사합니다.
`;

// Free models (무료 모델 우선 사용 - v1beta 호환)
const FREE_MODEL = "gemini-2.0-flash-exp"; // 무료 모델 (2024년 12월 기준)
const PREMIUM_MODEL = "gemini-1.5-pro"; // 유료 모델 (fallback)

export const analyzeSeniorTrends = async (): Promise<AnalysisResult> => {
  const ai = getAI();
  const prompt = "현재 유튜브에서 5060, 7080 세대에게 인기 있는 사연 채널들의 대본 특징을 분석해주세요. 주요 키워드, 인기 소재(노후 파산, 황혼 이혼, 효도 사기 등), 그리고 드라마 작법(갈등 고조 방식)을 분석해서 JSON으로 반환해주세요.";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      trends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "인기 있는 트렌드 분석" },
      keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "핵심 키워드" },
      dramaTechniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: "사용된 드라마 작법 기법" },
    },
    required: ["trends", "keywords", "dramaTechniques"],
  };

  try {
    const response = await ai.models.generateContent({
      model: FREE_MODEL, // 무료 모델 사용
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed", error);
    // Fallback data if API fails or blocks
    return {
      trends: ["황혼 육아 갈등", "노년의 재혼과 유산 상속", "자식에게 버림받은 부모의 성공"],
      keywords: ["배신", "복수", "인생 역전", "뒤늦은 깨달음"],
      dramaTechniques: ["초반 5초 후킹", "권선징악 구조", "감정적 독백"],
    };
  }
};

export const recommendTopics = async (): Promise<ScriptTopic[]> => {
  const ai = getAI();
  const prompt = "시니어 타겟 유튜브 채널을 위한 대박 예감 사연 주제 4가지를 추천해주세요. (노후 사연, 실화 기반, 반전 드라마, 황혼 로맨스 각 1개씩). JSON 형식으로.";

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        category: { type: Type.STRING, enum: ["retirement", "true_story", "twist", "romance"] },
        dramaTrope: { type: Type.STRING, description: "적용할 드라마 기법 (예: 출생의 비밀, 기억상실 등)" },
      },
      required: ["id", "title", "description", "category", "dramaTrope"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: FREE_MODEL, // 무료 모델 사용
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Recommendation failed", error);
    return [];
  }
};

export const generateFullScript = async (topic: ScriptTopic): Promise<GeneratedScript> => {
  const ai = getAI();
  // 무료 모델 사용 (긴 컨텍스트 처리 가능)
  const modelName = FREE_MODEL; 

  const prompt = `
  주제: ${topic.title}
  설명: ${topic.description}
  적용 기법: ${topic.dramaTrope}

  위 주제를 바탕으로 시니어들이 열광할 만한 60분 분량(읽는 속도 고려, 매우 긴 호흡)의 유튜브 사연 대본을 작성해주세요.
  
  [요구사항]
  1. **역추적 분석**: 먼저 이 대본이 왜 시니어에게 먹힐 수밖에 없는지, 어떤 한국 드라마의 기법(예: 김수현 작가의 대사 톤, 문영남 작가의 갈등 구조 등)을 차용했는지 '분석 노트'를 작성하세요.
  2. **캐릭터 설정**: 주인공(화자)과 주변 인물의 성격, 말투를 상세히 설정하세요.
  3. **대본 본문**: 
     - 오프닝: 시청자의 채널 고정을 유도하는 강력한 멘트.
     - 전개: 고구마 같은 답답한 현실과 갈등 심화.
     - 절정: 갈등의 폭발.
     - 결말: 사이다 같은 해결 혹은 가슴 뭉클한 교훈 (권선징악).
     - 내레이션 형식이지만, 중간중간 생생한 대화체가 섞인 라디오 드라마 스타일로 작성하세요.
     - 분량을 최대한 길게 뽑아주세요. (최소 5000자 이상).

  출력 포맷(JSON):
  {
    "title": "자극적인 썸네일용 제목",
    "logline": "한 줄 요약",
    "characters": "등장인물 소개",
    "analysisNote": "이 대본의 흥행 전략 분석",
    "fullScript": "대본 전체 내용..."
  }
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      logline: { type: Type.STRING },
      characters: { type: Type.STRING },
      analysisNote: { type: Type.STRING },
      fullScript: { type: Type.STRING },
    },
    required: ["title", "logline", "characters", "analysisNote", "fullScript"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Script generation empty");
    return JSON.parse(text) as GeneratedScript;
  } catch (error) {
    console.error("Script generation failed", error);
    throw error;
  }
};
