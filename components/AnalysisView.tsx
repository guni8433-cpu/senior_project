import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  data: AnalysisResult | null;
  isLoading: boolean;
  onNext: () => void;
}

export const AnalysisView: React.FC<Props> = ({ data, isLoading, onNext }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">유튜브 시니어 채널 트렌드를 분석 중입니다...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded mr-2">STEP 1</span>
          현재 트렌드 분석 보고서
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700 border-b pb-2">🔥 인기 트렌드</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {data.trends.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700 border-b pb-2">🔑 핵심 키워드</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.keywords.map((k, i) => (
                <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">#{k}</span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700 border-b pb-2">🎭 흥행 드라마 작법</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {data.dramaTechniques.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md flex items-center"
        >
          주제 추천 받기
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};
