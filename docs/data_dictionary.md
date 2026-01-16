# Data Dictionary

This document describes the JSON data files used by the Medical Malpractice Analytics Dashboard.

## Overview

All data files are located in `/public/data/` and are served as static JSON assets. The original data was exported from BigQuery as newline-delimited JSON (JSONL) files and converted to JSON arrays using the `scripts/convert-bq-jsonl.mjs` script.

---

## Data Files

### 1. kpi_summary.json

**Purpose:** High-level KPI metrics summarizing the entire malpractice claims dataset.

**Grain:** Single row (aggregate summary)

**Record Count:** 1

| Column | Type | Description |
|:-------|:-----|:------------|
| `total_claims` | string | Total number of malpractice claims in the dataset |
| `avg_amount` | number | Mean claim settlement/payout amount (USD) |
| `median_amount` | number | Median claim settlement/payout amount (USD) |
| `avg_severity` | number | Mean severity score across all claims (scale 1-10) |
| `claims_with_private_attorney` | string | Count of claims where claimant had private legal representation |
| `pct_private_attorney` | number | Percentage of claims with private attorney (0-1 decimal) |
| `bad_amount_rows` | string | Count of rows with invalid/null amount values (data quality) |
| `bad_age_rows` | string | Count of rows with invalid/null age values (data quality) |
| `bad_severity_rows` | string | Count of rows with invalid/null severity values (data quality) |

**BigQuery Source:**
```sql
SELECT
  COUNT(*) AS total_claims,
  AVG(amount) AS avg_amount,
  APPROX_QUANTILES(amount, 2)[OFFSET(1)] AS median_amount,
  AVG(severity) AS avg_severity,
  COUNTIF(attorney_type = 'Private') AS claims_with_private_attorney,
  COUNTIF(attorney_type = 'Private') / COUNT(*) AS pct_private_attorney,
  COUNTIF(amount IS NULL) AS bad_amount_rows,
  COUNTIF(age IS NULL) AS bad_age_rows,
  COUNTIF(severity IS NULL) AS bad_severity_rows
FROM `project.dataset.malpractice_claims`
```

---

### 2. severity_bucket_dist.json

**Purpose:** Distribution of claims across severity level buckets.

**Grain:** One row per severity bucket

**Record Count:** 3

| Column | Type | Description |
|:-------|:-----|:------------|
| `severity_bucket` | string | Severity range label (e.g., "Low (1-3)", "Medium (4-6)", "High (7-10)") |
| `claim_count` | string | Number of claims in this severity bucket |
| `avg_amount` | number | Average claim amount for this bucket (USD) |
| `median_amount` | number | Median claim amount for this bucket (USD) |

**BigQuery Source:**
```sql
SELECT
  CASE
    WHEN severity BETWEEN 1 AND 3 THEN 'Low (1-3)'
    WHEN severity BETWEEN 4 AND 6 THEN 'Medium (4-6)'
    WHEN severity BETWEEN 7 AND 10 THEN 'High (7-10)'
  END AS severity_bucket,
  COUNT(*) AS claim_count,
  AVG(amount) AS avg_amount,
  APPROX_QUANTILES(amount, 2)[OFFSET(1)] AS median_amount
FROM `project.dataset.malpractice_claims`
WHERE severity IS NOT NULL
GROUP BY severity_bucket
```

---

### 3. insurance_mix.json

**Purpose:** Breakdown of claims by insurance/payer type.

**Grain:** One row per insurance type

**Record Count:** 4

| Column | Type | Description |
|:-------|:-----|:------------|
| `insurance` | string | Insurance/payer category (Private, Medicare/Medicaid, No Insurance, Workers Compensation) |
| `claim_count` | string | Number of claims for this insurance type |
| `avg_amount` | number | Average claim amount for this insurance type (USD) |
| `median_amount` | number | Median claim amount for this insurance type (USD) |

**BigQuery Source:**
```sql
SELECT
  insurance_type AS insurance,
  COUNT(*) AS claim_count,
  AVG(amount) AS avg_amount,
  APPROX_QUANTILES(amount, 2)[OFFSET(1)] AS median_amount
FROM `project.dataset.malpractice_claims`
GROUP BY insurance_type
ORDER BY claim_count DESC
```

---

### 4. top_specialties.json

**Purpose:** Malpractice claim statistics aggregated by medical specialty.

**Grain:** One row per medical specialty

**Record Count:** 20

| Column | Type | Description |
|:-------|:-----|:------------|
| `specialty` | string | Medical specialty name (e.g., "Family Practice", "OBGYN", "Anesthesiology") |
| `claim_count` | string | Total number of claims against this specialty |
| `avg_amount` | number | Average claim amount for this specialty (USD) |
| `median_amount` | number | Median claim amount for this specialty (USD) |
| `avg_severity` | number | Average severity score for claims against this specialty |

**BigQuery Source:**
```sql
SELECT
  specialty,
  COUNT(*) AS claim_count,
  AVG(amount) AS avg_amount,
  APPROX_QUANTILES(amount, 2)[OFFSET(1)] AS median_amount,
  AVG(severity) AS avg_severity
FROM `project.dataset.malpractice_claims`
GROUP BY specialty
ORDER BY claim_count DESC
LIMIT 20
```

---

### 5. amount_by_insurance_severity.json

**Purpose:** Cross-tabulation of claim amounts by insurance type and severity level.

**Grain:** One row per insurance × severity combination

**Record Count:** 12 (4 insurance types × 3 severity buckets)

| Column | Type | Description |
|:-------|:-----|:------------|
| `insurance` | string | Insurance/payer category |
| `severity` | string | Severity bucket label |
| `claim_count` | string | Number of claims in this cell |
| `avg_amount` | number | Average claim amount for this combination (USD) |
| `median_amount` | number | Median claim amount for this combination (USD) |

**BigQuery Source:**
```sql
SELECT
  insurance_type AS insurance,
  CASE
    WHEN severity BETWEEN 1 AND 3 THEN 'Low (1-3)'
    WHEN severity BETWEEN 4 AND 6 THEN 'Medium (4-6)'
    WHEN severity BETWEEN 7 AND 10 THEN 'High (7-10)'
  END AS severity,
  COUNT(*) AS claim_count,
  AVG(amount) AS avg_amount,
  APPROX_QUANTILES(amount, 2)[OFFSET(1)] AS median_amount
FROM `project.dataset.malpractice_claims`
WHERE severity IS NOT NULL
GROUP BY insurance, severity
ORDER BY insurance, severity
```

---

## Data Pipeline

### Export Process

1. **BigQuery Export:** Each query is run in BigQuery and results are exported using "Save Results > JSON (Newline Delimited)"

2. **File Placement:** Downloaded files are placed in `data_raw/` directory

3. **Conversion:** Run `node scripts/convert-bq-jsonl.mjs` to:
   - Read JSONL files from `data_raw/`
   - Parse each line as JSON
   - Combine into a JSON array
   - Write to `public/data/` with pretty-printing

4. **Verification:** The conversion script validates all 5 required outputs exist

### Data Quality Notes

- Some numeric fields are stored as strings (e.g., `claim_count`, `total_claims`) due to BigQuery's JSON export behavior for large integers
- The frontend handles type coercion using `parseInt()` where needed
- Data quality metrics (`bad_*_rows`) are included in `kpi_summary.json` for transparency

---

## File Locations

| File | Path | Size |
|:-----|:-----|:-----|
| KPI Summary | `/public/data/kpi_summary.json` | ~320 bytes |
| Severity Distribution | `/public/data/severity_bucket_dist.json` | ~400 bytes |
| Insurance Mix | `/public/data/insurance_mix.json` | ~500 bytes |
| Top Specialties | `/public/data/top_specialties.json` | ~3.5 KB |
| Insurance × Severity | `/public/data/amount_by_insurance_severity.json` | ~1.6 KB |

---

## Usage in Frontend

```typescript
// Example: Loading KPI data
const { data, loading, error } = useFetch<KPISummary[]>('/data/kpi_summary.json');

// Example: Accessing values
const totalClaims = parseInt(data[0].total_claims, 10);
const avgAmount = data[0].avg_amount;
```

See `/src/types/index.ts` for TypeScript interfaces matching each data structure.
