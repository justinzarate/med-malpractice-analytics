import React, { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import {
    KPISummary,
    SeverityBucket,
    InsuranceMix,
    Specialty,
    InsuranceSeverity,
    DashboardControls,
    MetricType,
    TopNValue,
    SortField
} from './types';
import { KPISummaryComponent } from './components/KPISummary';
import { SeverityChart } from './components/SeverityChart';
import { InsuranceChart } from './components/InsuranceChart';
import { SpecialtiesTable } from './components/SpecialtiesTable';
import { InsuranceSeverityMatrix } from './components/InsuranceSeverityMatrix';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ControlsPanel } from './components/ControlsPanel';
import { InsightsPanel } from './components/InsightsPanel';

function App() {
    // Dashboard controls state
    const [controls, setControls] = useState<DashboardControls>({
        metric: 'avg_amount',
        topN: 20,
        sortBy: 'claim_count'
    });

    // Data fetching
    const kpiData = useFetch<KPISummary[]>('/data/kpi_summary.json');
    const severityData = useFetch<SeverityBucket[]>('/data/severity_bucket_dist.json');
    const insuranceData = useFetch<InsuranceMix[]>('/data/insurance_mix.json');
    const specialtiesData = useFetch<Specialty[]>('/data/top_specialties.json');
    const matrixData = useFetch<InsuranceSeverity[]>('/data/amount_by_insurance_severity.json');

    const isLoading = kpiData.loading || severityData.loading || insuranceData.loading ||
        specialtiesData.loading || matrixData.loading;

    // Find which file failed
    const getErrorDetails = () => {
        if (kpiData.error) return { message: kpiData.error, file: '/data/kpi_summary.json' };
        if (severityData.error) return { message: severityData.error, file: '/data/severity_bucket_dist.json' };
        if (insuranceData.error) return { message: insuranceData.error, file: '/data/insurance_mix.json' };
        if (specialtiesData.error) return { message: specialtiesData.error, file: '/data/top_specialties.json' };
        if (matrixData.error) return { message: matrixData.error, file: '/data/amount_by_insurance_severity.json' };
        return null;
    };

    const errorDetails = getErrorDetails();

    // Control handlers
    const handleMetricChange = (metric: MetricType) => {
        setControls(prev => ({ ...prev, metric }));
    };

    const handleTopNChange = (topN: TopNValue) => {
        setControls(prev => ({ ...prev, topN }));
    };

    const handleSortChange = (sortBy: SortField) => {
        setControls(prev => ({ ...prev, sortBy }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <LoadingSpinner message="Loading medical malpractice data..." />
            </div>
        );
    }

    if (errorDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <ErrorMessage
                    message={errorDetails.message}
                    failedFile={errorDetails.file}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Medical Malpractice Analytics
                            </h1>
                            <p className="text-slate-400 mt-1 text-sm">
                                Comprehensive claims analysis and insights dashboard
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span>Data Loaded</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Controls Panel */}
                <ControlsPanel
                    controls={controls}
                    onMetricChange={handleMetricChange}
                    onTopNChange={handleTopNChange}
                    onSortChange={handleSortChange}
                />

                {/* KPI Summary */}
                {kpiData.data && kpiData.data.length > 0 && (
                    <KPISummaryComponent data={kpiData.data[0]} />
                )}

                {/* Insights Panel */}
                <InsightsPanel
                    kpiData={kpiData.data?.[0] ?? null}
                    specialties={specialtiesData.data ?? null}
                    insuranceMix={insuranceData.data ?? null}
                    severityData={severityData.data ?? null}
                />

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {severityData.data && (
                        <SeverityChart data={severityData.data} />
                    )}
                    {insuranceData.data && (
                        <InsuranceChart data={insuranceData.data} />
                    )}
                </div>

                {/* Tables Section */}
                <div className="space-y-6">
                    {specialtiesData.data && (
                        <SpecialtiesTable
                            data={specialtiesData.data}
                            topN={controls.topN}
                            sortBy={controls.sortBy}
                            metric={controls.metric}
                        />
                    )}
                    {matrixData.data && (
                        <InsuranceSeverityMatrix
                            data={matrixData.data}
                            metric={controls.metric}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 mt-12 py-6">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                    <p className="text-center text-slate-500 text-sm">
                        Medical Malpractice Analytics Dashboard · Built with React + TypeScript + Recharts
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
