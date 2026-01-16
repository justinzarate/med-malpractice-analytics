# Medical Malpractice Analytics Dashboard

An interactive React dashboard for visualizing and analyzing medical malpractice claims data. Built with Vite, TypeScript, Tailwind CSS, and Recharts.

![Dashboard Preview](docs/preview.png)

## Features

- **KPI Cards** — Total claims, average/median amounts, attorney representation rate
- **Interactive Controls** — Toggle metrics, filter top specialties, sort data
- **Dynamic Insights** — Auto-generated insights computed from loaded data
- **Charts** — Severity distribution bar chart, insurance mix donut chart
- **Tables** — Sortable specialties table, insurance × severity heat map matrix
- **Responsive Design** — Mobile-first layout with horizontal table scrolling
- **Error Handling** — Friendly messages showing which data file failed to load

## Data Files

The dashboard loads static JSON data from `/public/data/`:

| File | Description |
|:-----|:------------|
| `kpi_summary.json` | Aggregate KPI metrics (1 row) |
| `severity_bucket_dist.json` | Claims by severity level (3 rows) |
| `insurance_mix.json` | Claims by insurance type (4 rows) |
| `top_specialties.json` | Top 20 medical specialties |
| `amount_by_insurance_severity.json` | Cross-tabulation matrix (12 rows) |

See [`docs/data_dictionary.md`](docs/data_dictionary.md) for detailed schema documentation.

## Requirements

- **Node.js 22+** (recommended via [nvm](https://github.com/nvm-sh/nvm))
- npm 9+

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd med-malpractice-demo

# Use correct Node version (if using nvm)
nvm use || nvm install

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
├── public/
│   └── data/              # Runtime JSON data files (committed)
├── data_raw/              # Source BigQuery exports (reference)
├── docs/
│   └── data_dictionary.md # Data schema documentation
├── scripts/
│   └── convert-bq-jsonl.mjs  # JSONL → JSON converter
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Data Pipeline

If you need to regenerate the data files from new BigQuery exports:

1. Export query results from BigQuery as newline-delimited JSON (JSONL)
2. Place downloaded files in `data_raw/`
3. Update the file mapping in `scripts/convert-bq-jsonl.mjs`
4. Run the conversion:

```bash
node scripts/convert-bq-jsonl.mjs
```

This reads JSONL from `data_raw/` and writes JSON arrays to `public/data/`.

## Troubleshooting

### Vite requires Node >= 22

This project uses Vite 7.x and Tailwind CSS 4.x, which require Node.js 22+.

```bash
# Check your Node version
node --version

# Upgrade using nvm
nvm install 22
nvm use 22

# Or install the LTS version
nvm install --lts
```

### Data not loading

- Verify JSON files exist in `/public/data/`
- Check browser console for fetch errors
- Ensure files contain valid JSON arrays (start with `[`)

### TypeScript errors

```bash
# Check for type errors
npm run typecheck
```

## Tech Stack

- **Framework**: [Vite](https://vite.dev/) 7.x
- **UI Library**: [React](https://react.dev/) 19.x
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.x
- **Charts**: [Recharts](https://recharts.org/) 3.x

## License

MIT
