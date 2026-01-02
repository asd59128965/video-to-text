
export interface TranscriptionResult {
  text: string;
  summary?: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  summaryStatus?: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  fileName?: string;
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}
