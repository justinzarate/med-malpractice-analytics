import React from 'react';
import { MetricType, TopNValue, SortField, DashboardControls } from '../types';

interface ControlsPanelProps {
    controls: DashboardControls;
    onMetricChange: (metric: MetricType) => void;
    onTopNChange: (topN: TopNValue) => void;
    onSortChange: (sortBy: SortField) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    controls,
    onMetricChange,
    onTopNChange,
    onSortChange
}) => {
    const metricOptions: { value: MetricType; label: string }[] = [
        { value: 'avg_amount', label: 'Average Amount' },
        { value: 'median_amount', label: 'Median Amount' },
        { value: 'claim_count', label: 'Claim Count' }
    ];

    const topNOptions: TopNValue[] = [10, 20, 50];

    const sortOptions: { value: SortField; label: string }[] = [
        { value: 'claim_count', label: 'Claims' },
        { value: 'avg_amount', label: 'Avg Amount' },
        { value: 'median_amount', label: 'Median Amount' },
        { value: 'avg_severity', label: 'Avg Severity' }
    ];

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Dashboard Controls</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Toggle */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Display Metric
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {metricOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onMetricChange(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${controls.metric === option.value
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top N Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Top Specialties Count
                    </label>
                    <div className="flex gap-2">
                        {topNOptions.map(n => (
                            <button
                                key={n}
                                onClick={() => onTopNChange(n)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${controls.topN === n
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                                    }`}
                            >
                                Top {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Sort Specialties By
                    </label>
                    <select
                        value={controls.sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortField)}
                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 cursor-pointer appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.25rem'
                        }}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
