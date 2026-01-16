import React, { useMemo } from 'react';
import { Specialty, SortField, MetricType } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface SpecialtiesTableProps {
    data: Specialty[];
    topN: number;
    sortBy: SortField;
    metric: MetricType;
}

export const SpecialtiesTable: React.FC<SpecialtiesTableProps> = ({
    data,
    topN,
    sortBy,
    metric
}) => {
    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
            switch (sortBy) {
                case 'claim_count':
                    return parseInt(b.claim_count, 10) - parseInt(a.claim_count, 10);
                case 'avg_amount':
                    return b.avg_amount - a.avg_amount;
                case 'median_amount':
                    return b.median_amount - a.median_amount;
                case 'avg_severity':
                    return b.avg_severity - a.avg_severity;
                default:
                    return 0;
            }
        });
        return sorted.slice(0, topN);
    }, [data, sortBy, topN]);

    const getMetricValue = (specialty: Specialty): string => {
        switch (metric) {
            case 'claim_count':
                return formatNumber(specialty.claim_count);
            case 'avg_amount':
                return formatCurrency(specialty.avg_amount);
            case 'median_amount':
                return formatCurrency(specialty.median_amount);
            default:
                return formatCurrency(specialty.avg_amount);
        }
    };

    const getMetricLabel = (): string => {
        switch (metric) {
            case 'claim_count':
                return 'Claims';
            case 'avg_amount':
                return 'Avg Amount';
            case 'median_amount':
                return 'Median Amount';
            default:
                return 'Amount';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Top {topN} Specialties
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                    Sorted by {sortBy.replace('_', ' ')}
                </span>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                                Specialty
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                                Claims
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                                <span className={metric === 'avg_amount' ? 'text-cyan-400' : ''}>
                                    Avg Amount
                                </span>
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                                <span className={metric === 'median_amount' ? 'text-cyan-400' : ''}>
                                    Median Amount
                                </span>
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                                Avg Severity
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((specialty, index) => (
                            <tr
                                key={specialty.specialty}
                                className="border-b border-slate-800/50 hover:bg-slate-700/20 transition-colors"
                            >
                                <td className="px-4 py-4 text-sm text-slate-500 font-medium">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-4 text-sm text-white font-medium">
                                    {specialty.specialty}
                                </td>
                                <td className={`px-4 py-4 text-sm text-right ${sortBy === 'claim_count' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                                    }`}>
                                    {formatNumber(specialty.claim_count)}
                                </td>
                                <td className={`px-4 py-4 text-sm text-right ${sortBy === 'avg_amount' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                                    }`}>
                                    {formatCurrency(specialty.avg_amount)}
                                </td>
                                <td className={`px-4 py-4 text-sm text-right ${sortBy === 'median_amount' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                                    }`}>
                                    {formatCurrency(specialty.median_amount)}
                                </td>
                                <td className={`px-4 py-4 text-sm text-right ${sortBy === 'avg_severity' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                                    }`}>
                                    {specialty.avg_severity.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
