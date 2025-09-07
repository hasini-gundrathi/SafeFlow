
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onToggleAnalysis: () => void;
  isAnalyzing: boolean;
  hasVideo: boolean;
}

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const StopIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
);


export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, videoRef, onToggleAnalysis, isAnalyzing, hasVideo }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-cyan-300">2. Monitor & Analyze</h2>
      <div className="aspect-video bg-black rounded-md overflow-hidden mb-4 relative">
        <video ref={videoRef} src={videoUrl} controls className="w-full h-full" loop muted playsInline/>
      </div>
      <button
        onClick={onToggleAnalysis}
        disabled={!hasVideo}
        className={`w-full flex items-center justify-center px-4 py-3 text-white font-bold rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed ${
          isAnalyzing 
          ? 'bg-red-600 hover:bg-red-500' 
          : 'bg-green-600 hover:bg-green-500'
        }`}
      >
        {isAnalyzing ? <StopIcon className="w-6 h-6 mr-2" /> : <PlayIcon className="w-6 h-6 mr-2" />}
        {isAnalyzing ? 'Stop Analysis' : 'Start Real-time Analysis'}
      </button>
    </div>
  );
};
