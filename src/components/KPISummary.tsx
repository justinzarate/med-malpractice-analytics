import React from 'react';
import { KPICard } from './KPICard';
import { KPISummary } from '../types';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

interface KPISummaryProps {
    data: KPISummary;
}

export const KPISummaryComponent: React.FC<KPISummaryProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <KPICard
                title="Total Claims"
                value={formatNumber(data.total_claims)}
                icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                }
                gradient="from-blue-500 to-blue-600"
                description="All malpractice claims"
            />

            <KPICard
                title="Average Amount"
                value={formatCurrency(data.avg_amount)}
                icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                gradient="from-emerald-500 to-emerald-600"
                description="Mean claim amount"
            />

            <KPICard
                title="Median Amount"
                value={formatCurrency(data.median_amount)}
                icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                }
                gradient="from-violet-500 to-violet-600"
                description="Median claim amount"
            />

            <KPICard
                title="Private Attorney"
                value={formatPercent(data.pct_private_attorney)}
                icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                }
                gradient="from-cyan-500 to-cyan-600"
                description="Claims with legal representation"
            />
        </div>
    );
};
