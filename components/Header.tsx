
import React from 'react';

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.493,1.033a1,1,0,0,1,3.014,0l6.213,3.55A1,1,0,0,1,21,5.464V12a9.011,9.011,0,0,1-8.1,8.947,1,1,0,0,1-.8,0A9.011,9.011,0,0,1,3,12V5.464a1,1,0,0,1,1.28-.881Z"></path>
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-20">
            <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center">
                <ShieldIcon className="w-8 h-8 text-blue-400 mr-3" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    SafeFlow <span className="text-blue-400 font-light">| Real-time Crowd Analysis</span>
                </h1>
            </div>
        </header>
    );
};
