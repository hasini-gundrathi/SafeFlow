
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AnalysisResult } from '../types';

interface RiskChartProps {
  data: AnalysisResult[];
}

export const RiskChart: React.FC<RiskChartProps> = ({ data }) => {
  // Add a timestamp or index to each data point for the x-axis
  const chartData = data.map((d, index) => ({ ...d, time: index + 1 }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="time" stroke="#A0AEC0" />
        <YAxis domain={[0, 100]} stroke="#A0AEC0" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: '#4A5568',
            color: '#E5E7EB',
          }}
          labelStyle={{ color: '#CBD5E0' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="riskScore" 
          stroke="#2dd4bf" // cyan-400
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: '#2dd4bf' }}
          name="Risk Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
