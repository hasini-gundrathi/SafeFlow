
import React, { useRef, useEffect, useState } from 'react';
import type { AnalysisResult, BoundingBox, HeatmapPoint } from '../types';

interface VideoFeedViewProps {
    source: 'live' | 'file';
    videoSrc: string | null;
    isAnalyzing: boolean;
    onToggleAnalysis: () => void;
    analysisResult: AnalysisResult | null;
    setFrameCaptureCallback: (callback: (() => string | null) | null) => void;
    onChangeSource: () => void;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
);
const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>
);
const SwitchCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
);


// Helper functions for drawing on canvas
const drawHeatmap = (ctx: CanvasRenderingContext2D, heatmap: HeatmapPoint[], width: number, height: number) => {
    ctx.clearRect(0, 0, width, height); // Clear previous drawings
    heatmap.forEach(p => {
        const x = p.x * width;
        const y = p.y * height;
        const radius = p.intensity * Math.min(width, height) * 0.1; 
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 0, 0, 0.6)`);
        gradient.addColorStop(0.5, `rgba(255, 165, 0, 0.3)`);
        gradient.addColorStop(1, `rgba(255, 255, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    });
};

const drawBoundingBoxes = (ctx: CanvasRenderingContext2D, people: { box: BoundingBox }[], width: number, height: number) => {
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.8)';
    ctx.lineWidth = 2;
    people.forEach(p => {
        const x = p.box.x * width;
        const y = p.box.y * height;
        const w = p.box.width * width;
        const h = p.box.height * height;
        ctx.strokeRect(x, y, w, h);
    });
};


export const VideoFeedView: React.FC<VideoFeedViewProps> = ({ source, videoSrc, isAnalyzing, onToggleAnalysis, analysisResult, setFrameCaptureCallback, onChangeSource }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSourceReady, setIsSourceReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
                if (videoRef.current) {
                    videoRef.current.src = "";
                    videoRef.current.srcObject = stream;
                }
                setIsSourceReady(true);
                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please check permissions.");
                setIsSourceReady(false);
            }
        };

        if (source === 'live') {
            startCamera();
        } else if (source === 'file' && videoSrc && videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = videoSrc;
            setIsSourceReady(true);
            setError(null);
        }

        return () => {
            // Stop camera stream when component unmounts or source changes
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [source, videoSrc]);

    // Set up frame capture callback for App component
    useEffect(() => {
        if (isSourceReady) {
            setFrameCaptureCallback(() => {
                if (!videoRef.current || videoRef.current.paused && source === 'file') return null;
                const canvas = document.createElement('canvas');
                // Use videoWidth/Height to get the intrinsic size of the video
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return null;
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL('image/jpeg', 0.8);
            });
        } else {
            setFrameCaptureCallback(null);
        }
        return () => setFrameCaptureCallback(null);
    }, [isSourceReady, setFrameCaptureCallback, source]);


    // Drawing effect
    useEffect(() => {
        if (analysisResult && canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
                drawHeatmap(ctx, analysisResult.heatmap, canvas.width, canvas.height);
                drawBoundingBoxes(ctx, analysisResult.people, canvas.width, canvas.height);
            }
        } else if (!isAnalyzing && canvasRef.current) {
             const ctx = canvasRef.current.getContext('2d');
             if(ctx) ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [analysisResult, isAnalyzing]);
    
    // Play/pause video file with analysis state
    useEffect(() => {
        if (source === 'file' && videoRef.current) {
            if (isAnalyzing) {
                videoRef.current.play().catch(e => console.error("Error playing video:", e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isAnalyzing, source]);

    // Stop analysis when video file ends
    useEffect(() => {
        const videoElement = videoRef.current;
        if (source === 'file' && videoElement) {
            const handleVideoEnd = () => {
                if (isAnalyzing) {
                    onToggleAnalysis();
                }
            };
            videoElement.addEventListener('ended', handleVideoEnd);
            return () => videoElement.removeEventListener('ended', handleVideoEnd);
        }
    }, [source, isAnalyzing, onToggleAnalysis]);

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-300">
                    {source === 'live' ? 'Live Video Feed' : 'Video File Analysis'}
                </h2>
                <button onClick={onChangeSource} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <SwitchCameraIcon className="w-5 h-5 mr-1" />
                    Change Source
                </button>
            </div>
            <div className="aspect-video bg-black rounded-md overflow-hidden mb-4 relative">
                <video 
                    ref={videoRef} 
                    autoPlay={source === 'live'}
                    playsInline 
                    muted 
                    loop={source === 'file'}
                    controls={source === 'file'}
                    className="w-full h-full" 
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
                {!isSourceReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4">
                        <h3 className="text-xl font-semibold text-gray-300">Waiting for video source...</h3>
                        {error && <p className="text-red-400 mt-2 text-center max-w-xs">{error}</p>}
                    </div>
                )}
            </div>
             <button
                onClick={onToggleAnalysis}
                disabled={!isSourceReady}
                className={`w-full flex items-center justify-center px-4 py-3 text-white font-bold rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed ${isAnalyzing
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
