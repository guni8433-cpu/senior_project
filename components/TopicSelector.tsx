import React from 'react';
import { ScriptTopic } from '../types';

interface Props {
  topics: ScriptTopic[];
  isLoading: boolean;
  onSelect: (topic: ScriptTopic) => void;
}

export const TopicSelector: React.FC<Props> = ({ topics, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500">대박 날 소재를 찾고 있습니다...</p>
      </div>
    );
  }

  const getIcon = (category: string) => {
    switch(category) {
      case 'retirement': return '🍂';
      case 'true_story': return '📢';
      case 'twist': return '⚡';
      case 'romance': return '💕';
      default: return '📝';
    }
  };

  const getColor = (category: string) => {
    switch(category) {
      case 'retirement': return 'bg-amber-50 border-amber-200 hover:border-amber-400';
      case 'true_story': return 'bg-blue-50 border-blue-200 hover:border-blue-400';
      case 'twist': return 'bg-purple-50 border-purple-200 hover:border-purple-400';
      case 'romance': return 'bg-rose-50 border-rose-200 hover:border-rose-400';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-teal-600">STEP 2</span> 주제를 선택하세요
        </h2>
        <span className="text-sm text-slate-500">AI가 엄선한 4가지 추천 사연</span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 ${getColor(topic.category)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-3xl">{getIcon(topic.category)}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white bg-opacity-60 px-2 py-1 rounded">
                {topic.category.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{topic.title}</h3>
            <p className="text-sm text-slate-700 mb-4 line-clamp-2">{topic.description}</p>
            <div className="text-xs text-slate-500 flex items-center">
              <span className="font-semibold mr-1">적용 기법:</span> {topic.dramaTrope}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
