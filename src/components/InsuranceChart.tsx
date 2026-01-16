import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { InsuranceMix } from '../types';
import { formatNumber, formatPercent } from '../utils/formatters';

interface InsuranceChartProps {
    data: InsuranceMix[];
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export const InsuranceChart: React.FC<InsuranceChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.insurance,
        value: parseInt(item.claim_count, 10),
    }));

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const renderCustomLabel = (entry: any) => {
        const percent = (entry.value / total);
        return formatPercent(percent);
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Insurance Mix
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Claims']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
