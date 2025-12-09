import React from 'react';
import { GeneratedScript } from '../types';
import { downloadAsTxt, downloadAsZip } from '../utils/downloadUtils';

interface Props {
  script: GeneratedScript;
  onReset: () => void;
}

export const ScriptResult: React.FC<Props> = ({ script, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{script.title}</h2>
              <p className="text-slate-300 italic">{script.logline}</p>
            </div>
            <div className="flex space-x-2">
               <button 
                onClick={() => downloadAsTxt(script)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
              >
                💾 TXT 저장
              </button>
              <button 
                onClick={() => downloadAsZip(script)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center"
              >
                📦 ZIP 저장
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid lg:grid-cols-3 gap-8">
          {/* Main Script Area */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">📜 대본 미리보기 (일부)</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-[600px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {script.fullScript}
            </div>
          </div>

          {/* Sidebar: Analysis & Characters */}
          <div className="space-y-6">
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                🕵️‍♂️ PD의 분석 노트 (역추적)
              </h3>
              <p className="text-sm text-amber-800 whitespace-pre-wrap leading-relaxed">
                {script.analysisNote}
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">
                👥 등장인물 설정
              </h3>
              <p className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                {script.characters}
              </p>
            </div>
            
             <button 
              onClick={onReset}
              className="w-full py-3 border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 rounded-lg font-medium transition-all"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
