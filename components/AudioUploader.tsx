
import React, { useRef } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-indigo-200 rounded-2xl shadow-sm hover:border-indigo-400 transition-colors">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">上傳音檔開始轉錄</h3>
      <p className="text-sm text-slate-500 mb-6 text-center">支援 MP3, WAV, M4A, AAC 等格式 (建議小於 20MB)</p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
        disabled={disabled}
      />
      
      <button
        onClick={triggerUpload}
        disabled={disabled}
        className={`px-8 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-lg transition-all transform active:scale-95 ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-400' : 'hover:bg-indigo-700 hover:shadow-indigo-200'
        }`}
      >
        選擇檔案
      </button>
    </div>
  );
};

export default AudioUploader;
