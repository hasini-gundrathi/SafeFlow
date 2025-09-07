
import React, { useRef } from 'react';

interface VideoUploaderProps {
  onFileChange: (file: File) => void;
  isAnalyzing: boolean;
}

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);


export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileChange, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleClick = () => {
    if (isAnalyzing) {
      alert("Please stop the current analysis before uploading a new video.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">1. Upload Video</h2>
      <p className="text-gray-400 mb-4">Select a video file of a crowd to begin the analysis. The system works best with clear, stable footage.</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="video/*"
        className="hidden"
        disabled={isAnalyzing}
      />
      <button
        onClick={handleClick}
        disabled={isAnalyzing}
        className="w-full flex items-center justify-center px-4 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <UploadIcon className="w-6 h-6 mr-2" />
        Select Video File
      </button>
    </div>
  );
};
