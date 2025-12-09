import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API Key를 입력해주세요.');
      return;
    }
    if (!apiKey.startsWith('AIza')) {
      setError('올바른 Google Gemini API Key 형식이 아닙니다.');
      return;
    }
    onSubmit(apiKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl">🔑</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800">API Key 입력</h2>
            <p className="text-sm text-slate-500">Google Gemini API Key가 필요합니다</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="AIza..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-slate-600 mb-2">
              <strong>API Key 발급 방법:</strong>
            </p>
            <ol className="text-xs text-slate-600 space-y-1 ml-4 list-decimal">
              <li>
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>에 접속
              </li>
              <li>Google 계정으로 로그인</li>
              <li>"Get API Key" 또는 "API Key 생성" 클릭</li>
              <li>생성된 Key를 복사하여 위에 붙여넣기</li>
            </ol>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              확인
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            💡 입력한 API Key는 브라우저에만 저장되며, 외부로 전송되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
