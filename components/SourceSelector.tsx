
import React, { useRef } from 'react';

// Icons for the buttons
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374a3.026 3.026 0 01.64 2.288V17.54a3.026 3.026 0 01-.64 2.288c-.512.79-1.375 1.322-2.342 1.374a49.52 49.52 0 01-5.312 0c-.967-.052-1.83-.585-2.342-1.374a3.026 3.026 0 01-.64-2.288V6.733a3.026 3.026 0 01.64-2.288c.512-.79 1.375-1.322 2.342-1.374zM8.25 6.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);

interface SourceSelectorProps {
  onSelectLive: () => void;
  onSelectFile: (file: File) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({ onSelectLive, onSelectFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to SafeFlow</h1>
        <p className="text-lg text-gray-400 mb-12">Choose a video source to begin crowd analysis.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Live Camera Option */}
            <div
                onClick={onSelectLive}
                className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700 hover:border-blue-500 hover:scale-105 transform-gpu transition-all duration-300 cursor-pointer flex flex-col items-center"
            >
                <CameraIcon className="w-20 h-20 text-blue-400 mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">Live Camera Feed</h2>
                <p className="text-gray-400">Use your device's camera for real-time, on-the-spot analysis.</p>
            </div>

            {/* Upload File Option */}
            <div
                onClick={handleUploadClick}
                className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700 hover:border-cyan-500 hover:scale-105 transform-gpu transition-all duration-300 cursor-pointer flex flex-col items-center"
            >
                <UploadIcon className="w-20 h-20 text-cyan-400 mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">Upload Video File</h2>
                <p className="text-gray-400">Analyze pre-recorded footage from CCTV or other sources.</p>
            </div>
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
        />
        <footer className="absolute bottom-4 text-gray-600 text-sm">
            SafeFlow Crowd Analysis AI
        </footer>
    </div>
  );
};
