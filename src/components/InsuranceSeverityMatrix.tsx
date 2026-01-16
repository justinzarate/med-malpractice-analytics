import React, { useMemo } from 'react';
import { InsuranceSeverity, MetricType } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface InsuranceSeverityMatrixProps {
    data: InsuranceSeverity[];
    metric: MetricType;
}

export const InsuranceSeverityMatrix: React.FC<InsuranceSeverityMatrixProps> = ({ data, metric }) => {
    // Create matrix structure
    const { matrix, insuranceTypes, severityLevels, maxValue, minValue } = useMemo(() => {
        const insuranceSet = new Set<string>();
        const severitySet = new Set<string>();
        const matrixMap = new Map<string, InsuranceSeverity>();
        let max = 0;
        let min = Infinity;

        data.forEach(item => {
            insuranceSet.add(item.insurance);
            severitySet.add(item.severity);
            const key = `${item.insurance}|${item.severity}`;
            matrixMap.set(key, item);

            const value = metric === 'claim_count'
                ? parseInt(item.claim_count, 10)
                : metric === 'median_amount'
                    ? item.median_amount
                    : item.avg_amount;

            max = Math.max(max, value);
            min = Math.min(min, value);
        });

        return {
            matrix: matrixMap,
            insuranceTypes: Array.from(insuranceSet).sort(),
            severityLevels: Array.from(severitySet).sort(),
            maxValue: max,
            minValue: min
        };
    }, [data, metric]);

    const getValue = (item: InsuranceSeverity | undefined): number => {
        if (!item) return 0;
        switch (metric) {
            case 'claim_count':
                return parseInt(item.claim_count, 10);
            case 'median_amount':
                return item.median_amount;
            case 'avg_amount':
            default:
                return item.avg_amount;
        }
    };

    const formatValue = (item: InsuranceSeverity | undefined): string => {
        if (!item) return '—';
        switch (metric) {
            case 'claim_count':
                return formatNumber(item.claim_count);
            case 'median_amount':
                return formatCurrency(item.median_amount);
            case 'avg_amount':
            default:
                return formatCurrency(item.avg_amount);
        }
    };

    const getHeatmapColor = (value: number): string => {
        if (value === 0) return 'bg-slate-800 border-slate-700';

        const range = maxValue - minValue;
        const normalized = range > 0 ? (value - minValue) / range : 0;

        if (normalized > 0.75) return 'bg-red-500/30 border-red-500/50';
        if (normalized > 0.5) return 'bg-orange-500/30 border-orange-500/50';
        if (normalized > 0.25) return 'bg-yellow-500/30 border-yellow-500/50';
        return 'bg-green-500/30 border-green-500/50';
    };

    const getMetricLabel = (): string => {
        switch (metric) {
            case 'claim_count':
                return 'Claim Count';
            case 'median_amount':
                return 'Median Amount';
            case 'avg_amount':
            default:
                return 'Avg Amount';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Insurance × Severity Matrix
                </h2>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                    Showing: {getMetricLabel()}
                </span>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[500px] border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300 border-b border-slate-700/50">
                                Insurance / Severity
                            </th>
                            {severityLevels.map(severity => (
                                <th
                                    key={severity}
                                    className="px-4 py-3 text-center text-sm font-semibold text-slate-300 border-b border-slate-700/50"
                                >
                                    {severity}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {insuranceTypes.map((insurance, rowIndex) => (
                            <tr
                                key={insurance}
                                className={rowIndex !== insuranceTypes.length - 1 ? 'border-b border-slate-800/50' : ''}
                            >
                                <td className="px-4 py-4 text-sm text-white font-medium">
                                    {insurance}
                                </td>
                                {severityLevels.map(severity => {
                                    const key = `${insurance}|${severity}`;
                                    const item = matrix.get(key);
                                    const value = getValue(item);

                                    return (
                                        <td key={severity} className="px-2 py-2">
                                            <div
                                                className={`${getHeatmapColor(value)} border rounded-lg px-3 py-2 text-center text-sm font-medium text-white transition-all hover:scale-105`}
                                            >
                                                {formatValue(item)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-end gap-6 text-xs text-slate-400">
                <span>Heat Map:</span>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/30 border border-green-500/50 rounded"></div>
                    <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500/50 rounded"></div>
                    <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500/30 border border-orange-500/50 rounded"></div>
                    <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500/30 border border-red-500/50 rounded"></div>
                    <span>Very High</span>
                </div>
            </div>
        </div>
    );
};
