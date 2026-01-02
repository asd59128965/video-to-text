
import React from 'react';

interface ResultDisplayProps {
  text: string;
  summary?: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  summaryStatus?: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  fileName?: string;
  onGenerateSummary: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  text, 
  summary, 
  status, 
  summaryStatus, 
  errorMessage, 
  fileName,
  onGenerateSummary
}) => {
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('已複製到剪貼簿！');
  };

  const downloadReport = () => {
    const date = new Date().toLocaleDateString();
    const content = `# 會議轉錄報告\n\n**日期：** ${date}\n**來源檔案：** ${fileName || '未命名'}\n\n${summary ? `## 📝 智慧會議記錄\n\n${summary}\n\n---\n\n` : ''}## 📄 原始逐字稿\n\n${text}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `會議報告_${fileName || '轉錄'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (status === 'idle') return null;

  if (status === 'processing') {
    return (
      <div className="mt-8 p-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h4 className="text-xl font-medium text-slate-800 mb-2">正在分析音訊並轉錄中...</h4>
        <p className="text-slate-500">Gemini 3 Flash 正在為您生成精確的繁體中文逐字稿</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 text-red-700">
        <p className="font-bold">轉錄發生錯誤：{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 操作按鈕區 */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px] sm:max-w-xs">{fileName}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyToClipboard(text)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            複製逐字稿
          </button>
          
          <button
            onClick={downloadReport}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors shadow-sm flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>下載報告</span>
          </button>

          <button
            onClick={onGenerateSummary}
            disabled={summaryStatus === 'processing'}
            className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md flex items-center space-x-2 transition-all active:scale-95 ${
              summaryStatus === 'processing' ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {summaryStatus === 'processing' ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            )}
            <span>產生會議記錄</span>
          </button>
        </div>
      </div>

      {/* 會議記錄展示區 */}
      {summary && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center">
              <span className="mr-2">📝</span> 智慧會議記錄
            </h3>
            <button 
              onClick={() => copyToClipboard(summary)}
              className="text-xs text-indigo-700 underline hover:text-indigo-900 font-medium"
            >
              複製紀錄內容
            </button>
          </div>
          <div className="prose prose-indigo max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        </div>
      )}

      {/* 逐字稿展示區 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">原始逐字稿</h4>
          <span className="text-xs text-slate-400">內容字數：{text.length} 字</span>
        </div>
        <div className="p-6 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-normal">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
