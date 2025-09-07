
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoFeedView } from './components/CameraView';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { SourceSelector } from './components/SourceSelector';
import { analyzeFrame } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [source, setSource] = useState<'live' | 'file' | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  const analysisLoopRef = useRef<number | null>(null);
  const frameCaptureCallbackRef = useRef<(() => string | null) | null>(null);

  useEffect(() => {
    // Cleanup object URL on component unmount or source change
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const stopAnalysis = useCallback(() => {
    if (analysisLoopRef.current) {
        clearTimeout(analysisLoopRef.current);
        analysisLoopRef.current = null;
    }
    setIsAnalyzing(false);
    setIsLoading(false); // Ensure loading is reset
  }, []);

  const processFrame = useCallback(async () => {
    if (!frameCaptureCallbackRef.current) {
      console.warn("Frame capture callback not set. Stopping analysis.");
      stopAnalysis();
      return;
    }

    const frameDataUrl = frameCaptureCallbackRef.current();
    if (!frameDataUrl) {
        // If no frame is returned (e.g., video paused), just skip this tick.
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeFrame(frameDataUrl);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Check API key and network.');
      stopAnalysis();
    } finally {
      setIsLoading(false);
    }
  }, [stopAnalysis]);


  const startAnalysis = useCallback(() => {
      if(isAnalyzing) return;
      setIsAnalyzing(true);
  }, [isAnalyzing]);
  
  const handleToggleAnalysis = useCallback(() => {
    if (isAnalyzing) {
      stopAnalysis();
    } else {
      startAnalysis();
    }
  }, [isAnalyzing, startAnalysis, stopAnalysis]);

  // The main analysis loop controller
  useEffect(() => {
      if (!isAnalyzing) {
          return;
      }
      
      let isCancelled = false;

      const analysisLoop = async () => {
          if (isCancelled) return;

          await processFrame();
          
          if (isCancelled) return;

          // Schedule the next analysis after the current one is complete
          const interval = source === 'live' ? 5000 : 2000;
          analysisLoopRef.current = window.setTimeout(analysisLoop, interval);
      };

      analysisLoop();

      return () => {
          isCancelled = true;
          if (analysisLoopRef.current) {
              clearTimeout(analysisLoopRef.current);
          }
      };
  }, [isAnalyzing, processFrame, source]);

  
  const setFrameCaptureCallback = (callback: (() => string | null) | null) => {
    frameCaptureCallbackRef.current = callback;
  };

  const handleLiveSelect = () => setSource('live');

  const handleFileSelect = (file: File) => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    setVideoSrc(URL.createObjectURL(file));
    setSource('file');
  };

  const handleChangeSource = () => {
    stopAnalysis();
    setAnalysis(null);
    setError(null);
    setSource(null);
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
      setVideoSrc(null);
    }
  };

  if (!source) {
    return <SourceSelector onSelectLive={handleLiveSelect} onSelectFile={handleFileSelect} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <VideoFeedView 
              source={source}
              videoSrc={videoSrc}
              isAnalyzing={isAnalyzing}
              onToggleAnalysis={handleToggleAnalysis}
              analysisResult={analysis}
              setFrameCaptureCallback={setFrameCaptureCallback}
              onChangeSource={handleChangeSource}
            />
          </div>
          <div className="lg:col-span-2">
            <AnalysisDashboard 
              analysis={analysis}
              isLoading={isLoading}
              error={error}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
