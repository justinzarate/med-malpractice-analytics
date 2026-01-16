export interface KPISummary {
    total_claims: string;
    avg_amount: number;
    median_amount: number;
    avg_severity: number;
    claims_with_private_attorney: string;
    pct_private_attorney: number;
    bad_amount_rows: string;
    bad_age_rows: string;
    bad_severity_rows: string;
}

export interface SeverityBucket {
    severity_bucket: string;
    claim_count: string;
    avg_amount: number;
    median_amount: number;
}

export interface InsuranceMix {
    insurance: string;
    claim_count: string;
    avg_amount: number;
    median_amount: number;
}

export interface Specialty {
    specialty: string;
    claim_count: string;
    avg_amount: number;
    median_amount: number;
    avg_severity: number;
}

export interface InsuranceSeverity {
    insurance: string;
    severity: string;
    claim_count: string;
    avg_amount: number;
    median_amount: number;
}

// Dashboard control types
export type MetricType = 'avg_amount' | 'median_amount' | 'claim_count';
export type TopNValue = 10 | 20 | 50;
export type SortField = 'claim_count' | 'avg_amount' | 'median_amount' | 'avg_severity';

export interface DashboardControls {
    metric: MetricType;
    topN: TopNValue;
    sortBy: SortField;
}

// Insight type for dynamic insights
export interface Insight {
    icon: 'trend-up' | 'trend-down' | 'alert' | 'info' | 'star';
    title: string;
    description: string;
    value?: string;
}
