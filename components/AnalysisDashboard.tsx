
import React from 'react';
import type { AnalysisResult, CrowdMetrics } from '../types';

interface AnalysisDashboardProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  isAnalyzing: boolean;
}

const riskLevelStyles = {
    SAFE: { text: 'text-green-300', bg: 'bg-green-500/20', border: 'border-green-400', label: 'SAFE' },
    RISK: { text: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-400', label: 'RISK' },
    STAMPEDE: { text: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-400', label: 'STAMPEDE (CRITICAL)' },
};

const MetricCard: React.FC<{ title: string; value: string | number; unit?: string }> = ({ title, value, unit }) => (
    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-cyan-300">
            {value}
            {unit && <span className="text-lg ml-1 text-gray-400">{unit}</span>}
        </p>
    </div>
);

const SkeletonCard: React.FC = () => (
    <div className="bg-gray-800/50 p-3 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
    </div>
);


export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, isLoading, error, isAnalyzing }) => {
    
    const renderContent = () => {
        if (!isAnalyzing && !analysis) {
            return <p className="text-gray-500 text-center py-10">Start analysis to view live crowd data.</p>;
        }
        
        if (isLoading && !analysis) {
            return (
                 <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg animate-pulse">
                        <div className="h-5 bg-gray-700 rounded w-1/3 mx-auto mb-3"></div>
                        <div className="h-10 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            );
        }

        if (!analysis) {
             return <p className="text-gray-500 text-center py-10">Waiting for first analysis frame...</p>;
        }
        
        const { riskLevel, metrics, people } = analysis;
        const styles = riskLevelStyles[riskLevel];

        return (
            <div className="space-y-4">
                <div className={`border ${styles.border} ${styles.bg} rounded-lg p-4 text-center transition-all duration-300`}>
                    <p className="text-sm uppercase tracking-wider">StampedeRiskNet Assessment</p>
                    <p className={`text-4xl font-bold ${styles.text}`}>{styles.label}</p>
                </div>
                
                <h3 className="font-semibold text-gray-300 pt-2">Crowd Dynamics</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <MetricCard title="Person Count" value={people.length} />
                    <MetricCard title="Density" value={(metrics.density * 100).toFixed(0)} unit="%" />
                    <MetricCard title="Pressure" value={(metrics.pressure * 100).toFixed(0)} unit="%" />
                    <MetricCard title="Flow Variance" value={(metrics.flowVariance * 100).toFixed(0)} unit="%" />
                    <MetricCard title="Velocity Var" value={(metrics.velocityVariance * 100).toFixed(0)} unit="%" />
                    <MetricCard title="Velocity Spikes" value={metrics.velocitySpikes} />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
            <h2 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
                Live Analysis
                {isLoading && <div className="ml-3 w-5 h-5 border-2 border-t-blue-400 border-gray-600 rounded-full animate-spin"></div>}
            </h2>
            
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-md mb-4">{error}</div>}
            
            {renderContent()}
        </div>
    );
};
