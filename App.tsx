import React, { useState, useEffect } from 'react';
import { analyzeSeniorTrends, recommendTopics, generateFullScript, getApiKey, setApiKey } from './services/geminiService';
import { AnalysisResult, ScriptTopic, GeneratedScript, AppStep } from './types';
import { AnalysisView } from './components/AnalysisView';
import { TopicSelector } from './components/TopicSelector';
import { ScriptResult } from './components/ScriptResult';
import { ApiKeyModal } from './components/ApiKeyModal';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.DASHBOARD);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [topics, setTopics] = useState<ScriptTopic[]>([]);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check API Key on mount
  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
    } else {
      initAnalysis();
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string, remember: boolean) => {
    if (remember) {
      setApiKey(apiKey);
    } else {
      // 기억하지 않으면 세션 스토리지에만 저장
      sessionStorage.setItem('GEMINI_API_KEY_TEMP', apiKey);
    }
    setShowApiKeyModal(false);
    initAnalysis();
  };

  const initAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzeSeniorTrends();
      setAnalysis(data);
    } catch (e) {
      setError("초기 분석 데이터 로드 실패. API 키를 확인해주세요.");
      setShowApiKeyModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recommendTopics();
      setTopics(data);
      setStep(AppStep.TOPIC_SELECTION);
    } catch (e) {
      setError("주제 추천 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async (topic: ScriptTopic) => {
    setStep(AppStep.GENERATING);
    setError(null);
    try {
      const script = await generateFullScript(topic);
      setGeneratedScript(script);
      setStep(AppStep.RESULT);
    } catch (e) {
      setError("대본 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStep(AppStep.TOPIC_SELECTION);
    }
  };

  const resetApp = () => {
    setStep(AppStep.DASHBOARD);
    setGeneratedScript(null);
    setTopics([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* API Key Modal */}
      {showApiKeyModal && <ApiKeyModal onSubmit={handleApiKeySubmit} />}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">👴</span>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Senior Storyteller AI</h1>
              <p className="text-xs text-slate-500">시니어 전문 유튜브 대본 생성기</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-slate-600 transition"
              title="API Key 재설정"
            >
              🔑 API Key
            </button>
            <div className="text-xs font-mono bg-green-50 px-3 py-1 rounded text-green-700 border border-green-200">
               ✓ 무료 모델 (Gemini 2.0 Flash)
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Dashboard */}
        {step === AppStep.DASHBOARD && (
          <div className="animate-fade-in-up">
            <div className="mb-8 text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">어떤 이야기를 만들까요?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                현재 시니어 유튜브 시장을 분석하여 가장 인기 있는 소재를 추천하고, 
                <br/>드라마 작법을 적용한 고품질 대본을 생성해드립니다.
              </p>
            </div>
            <AnalysisView 
              data={analysis} 
              isLoading={loading} 
              onNext={handleRequestTopics} 
            />
          </div>
        )}

        {/* Step 2: Topic Selection */}
        {step === AppStep.TOPIC_SELECTION && (
          <div className="animate-fade-in-up">
             <TopicSelector 
              topics={topics} 
              isLoading={loading} 
              onSelect={handleGenerateScript} 
             />
             <div className="mt-8 flex justify-center">
               <button onClick={resetApp} className="text-slate-500 hover:text-slate-700 text-sm underline">
                 처음으로 돌아가기
               </button>
             </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === AppStep.GENERATING && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-800">대본을 집필 중입니다...</h3>
            <p className="mt-2 text-slate-600 text-center max-w-md">
              PD님이 선택하신 소재로 드라마틱한 전개를 구성하고 있습니다. <br/>
              60분 분량의 호흡을 위해 심층적인 사고 과정을 거치고 있으니 잠시만 기다려주세요.
            </p>
            <div className="mt-4 flex space-x-2 text-sm text-slate-400">
               <span>💭 캐릭터 설정</span>
               <span>→</span>
               <span>📝 플롯 구성</span>
               <span>→</span>
               <span>✍️ 대본 작성</span>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === AppStep.RESULT && generatedScript && (
          <div className="animate-fade-in-up">
            <ScriptResult 
              script={generatedScript} 
              onReset={resetApp} 
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
