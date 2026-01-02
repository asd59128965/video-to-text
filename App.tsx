
import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import ResultDisplay from './components/ResultDisplay';
import { TranscriptionResult, FileData } from './types';
import { transcribeAudio, generateSummary } from './services/geminiService';

const App: React.FC = () => {
  const [result, setResult] = useState<TranscriptionResult>({
    text: '',
    status: 'idle',
    summaryStatus: 'idle',
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1] || '';
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setResult({
      text: '',
      summary: '',
      status: 'processing',
      summaryStatus: 'idle',
      fileName: file.name,
    });

    try {
      const base64 = await fileToBase64(file);
      const fileData: FileData = {
        base64,
        mimeType: file.type || 'audio/mp3',
        name: file.name,
      };

      const transcript = await transcribeAudio(fileData);
      setResult(prev => ({
        ...prev,
        text: transcript,
        status: 'success',
      }));
    } catch (error: any) {
      setResult(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error.message,
      }));
    }
  };

  const handleGenerateSummary = async () => {
    if (!result.text || result.summaryStatus === 'processing') return;

    setResult(prev => ({ ...prev, summaryStatus: 'processing' }));

    try {
      const summaryText = await generateSummary(result.text);
      setResult(prev => ({
        ...prev,
        summary: summaryText,
        summaryStatus: 'success',
      }));
    } catch (error: any) {
      setResult(prev => ({
        ...prev,
        summaryStatus: 'error',
        errorMessage: "摘要產生失敗: " + error.message,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700 tracking-tight">
              Gemini 智聽
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              Gemini 3 Flash 模式
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            從語音到決策，<br/><span className="text-indigo-600">一鍵搞定會議記錄</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            上傳音檔後，我們不僅為您精確轉錄逐字稿，還能自動摘要出會議重點與行動清單。
          </p>
        </div>

        <AudioUploader 
          onFileSelect={handleFileSelect} 
          disabled={result.status === 'processing'} 
        />

        <ResultDisplay 
          text={result.text}
          summary={result.summary}
          status={result.status}
          summaryStatus={result.summaryStatus}
          errorMessage={result.errorMessage}
          fileName={result.fileName}
          onGenerateSummary={handleGenerateSummary}
        />
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-4 mt-20 pt-8 border-t border-slate-200 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <div className="text-xs text-slate-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
            精確轉錄
          </div>
          <div className="text-xs text-slate-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            發言人辨識
          </div>
          <div className="text-xs text-slate-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.197.451 1 1 0 01-.328 1.22L6.232 5.5a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V8.564a1 1 0 112 0V11a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 013.232 11V6a2.5 2.5 0 012.5-2.5h2.51l3.058-2.453a1 1 0 011-.1zM14.5 2.5a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5h-5z" clipRule="evenodd" /></svg>
            AI 摘要
          </div>
        </div>
        <p className="text-xs text-slate-400 tracking-widest">
          MADE WITH GOOGLE GEMINI 3 FLASH • 繁體中文專業版
        </p>
      </footer>
    </div>
  );
};

export default App;
