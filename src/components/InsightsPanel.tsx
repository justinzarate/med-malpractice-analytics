import React, { useMemo } from 'react';
import { Insight, KPISummary, Specialty, InsuranceMix, SeverityBucket } from '../types';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

interface InsightsPanelProps {
    kpiData: KPISummary | null;
    specialties: Specialty[] | null;
    insuranceMix: InsuranceMix[] | null;
    severityData: SeverityBucket[] | null;
}

const InsightIcon: React.FC<{ type: Insight['icon'] }> = ({ type }) => {
    switch (type) {
        case 'trend-up':
            return (
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            );
        case 'trend-down':
            return (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            );
        case 'alert':
            return (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case 'star':
            return (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        default:
            return (
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
    kpiData,
    specialties,
    insuranceMix,
    severityData
}) => {
    const insights = useMemo<Insight[]>(() => {
        const result: Insight[] = [];

        if (!kpiData || !specialties || !insuranceMix || !severityData) {
            return result;
        }

        // Insight 1: Private attorney impact
        const pctAttorney = kpiData.pct_private_attorney;
        if (pctAttorney > 0.5) {
            result.push({
                icon: 'info',
                title: 'High Legal Representation',
                description: `${formatPercent(pctAttorney)} of claims involve private attorneys, indicating claimants frequently seek legal counsel.`,
                value: formatPercent(pctAttorney)
            });
        }

        // Insight 2: Top specialty by claims
        if (specialties.length > 0) {
            const topSpecialty = [...specialties].sort((a, b) =>
                parseInt(b.claim_count) - parseInt(a.claim_count)
            )[0];
            const totalClaims = parseInt(kpiData.total_claims);
            const topPct = parseInt(topSpecialty.claim_count) / totalClaims;

            result.push({
                icon: 'trend-up',
                title: `${topSpecialty.specialty} Leads in Claims`,
                description: `${formatNumber(topSpecialty.claim_count)} claims (${formatPercent(topPct)} of total), with average payout of ${formatCurrency(topSpecialty.avg_amount)}.`
            });
        }

        // Insight 3: Highest average payout specialty
        if (specialties.length > 0) {
            const highestPayout = [...specialties].sort((a, b) => b.avg_amount - a.avg_amount)[0];

            result.push({
                icon: 'alert',
                title: `${highestPayout.specialty} Has Highest Payouts`,
                description: `Average claim of ${formatCurrency(highestPayout.avg_amount)} — ${formatCurrency(highestPayout.avg_amount - kpiData.avg_amount)} above overall average.`
            });
        }

        // Insight 4: Severity distribution
        if (severityData.length > 0) {
            const highSeverity = severityData.find(s => s.severity_bucket.includes('High'));
            const totalSeverityClaims = severityData.reduce((sum, s) => sum + parseInt(s.claim_count), 0);

            if (highSeverity) {
                const highPct = parseInt(highSeverity.claim_count) / totalSeverityClaims;
                result.push({
                    icon: highPct > 0.3 ? 'trend-up' : 'info',
                    title: 'High Severity Claims',
                    description: `${formatPercent(highPct)} of claims are high severity (7-10), averaging ${formatCurrency(highSeverity.avg_amount)} per claim.`
                });
            }
        }

        // Insight 5: Insurance type with highest average
        if (insuranceMix.length > 0) {
            const sorted = [...insuranceMix].sort((a, b) => b.avg_amount - a.avg_amount);
            const highest = sorted[0];
            const lowest = sorted[sorted.length - 1];
            const diff = highest.avg_amount - lowest.avg_amount;

            result.push({
                icon: 'star',
                title: 'Insurance Type Matters',
                description: `"${highest.insurance}" claims average ${formatCurrency(highest.avg_amount)} — ${formatCurrency(diff)} more than "${lowest.insurance}".`
            });
        }

        return result.slice(0, 5);
    }, [kpiData, specialties, insuranceMix, severityData]);

    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Key Insights</h2>
                <span className="text-xs text-slate-500 ml-2">(Computed from data)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <InsightIcon type={insight.icon} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white mb-1 truncate">
                                    {insight.title}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
