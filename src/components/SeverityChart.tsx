import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SeverityBucket } from '../types';
import { formatNumber } from '../utils/formatters';

interface SeverityChartProps {
    data: SeverityBucket[];
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c026d3'];

export const SeverityChart: React.FC<SeverityChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.severity_bucket,
        claims: parseInt(item.claim_count, 10),
    }));

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Claims by Severity
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                        tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Claims']}
                        labelStyle={{ color: '#9ca3af' }}
                    />
                    <Bar dataKey="claims" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
