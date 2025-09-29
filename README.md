# Emotion Trend Visualization (Clinician Dashboard)

This project is a **clinician-focused dashboard** for visualizing mood-over-time data. It uses React and charting libraries (D3.js and Recharts) to help clinicians observe trends, anomalies, and weekly summaries in patients' mood data. The project includes a mock API for testing and demonstration purposes.

---

## Project Structure
    src/
    ├── api/
    │ └── mockapi.ts # Mock data generation
    ├── components/
    │ ├── D3MoodChartStyled.tsx # Custom D3.js chart component
    │ ├── RechartsMoodChartStyled.tsx # Recharts chart component
    │ ├── MuiDateRange.tsx # MUI date range picker
    │ └── SummaryCard.tsx # Weekly summary and anomaly card
    ├── hooks/
    │ └── useMoodData.ts # Hook to fetch and process mood entries
    ├── utils/
    │ └── analysis.ts # Functions for rolling averages, weekly stats, anomaly detection
    └── App.tsx # Main dashboard component

---

## Key Features

1. **Dual Charting Approach**
   - **D3.js**: Fully customized, interactive chart with gradient fills, background bands for context, rolling averages, and anomaly markers.
   - **Recharts**: Simplified and responsive chart alternative with similar functionality for comparison or fallback.

2. **Date Filtering**
   - Users can select a **custom date range** using a Material UI date picker.
   - Charts and weekly summaries update dynamically based on the selected range.

3. **Weekly Summaries & Trends**
   - The `SummaryCard` component shows weekly averages with intuitive emojis.
   - Displays trend delta between first and last week.
   - Highlights anomaly counts to catch sudden mood changes.

4. **Anomaly Detection**
   - Occasional random anomalies are injected in the mock data to simulate extreme mood events.
   - Both charts highlight anomalies for easy visual inspection.

5. **Accessibility Considerations**
   - Color bands have subtle opacity to avoid overwhelming users.
   - Tooltips are readable and positioned dynamically.
   - Components use semantic MUI elements and proper sizing.

---

## Mock API

- File: `src/api/mockapi.ts`
- Generates mood entries for the past `N` days (default 180) with:
  - **Score range:** 1–5 (integer)
  - **Weekly seasonality:** Simulates gentle weekly mood cycles
  - **Random noise:** Adds variation to emulate real-life mood fluctuations
  - **Occasional anomalies:** 2% chance of extreme scores to flag unusual events
  - **Optional manual notes:** 5% chance of textual note

```ts
const entries = await fetchMockMoodEntries(180);
```

## Modules & Libraries Used
| Module | Purpose |
|--------|---------|
| React | Base framework for building interactive UI |
| D3.js | Custom, flexible charting for advanced visualization |
| Recharts | Quick and responsive charting alternative |
| @mui/material & @mui/x-date-pickers | UI components including date pickers and cards |
| date-fns | Date manipulation (formatting, parsing, offsets) |
| TypeScript | Strong typing for safer, clearer code |
| ES Modules | Modern module organization for clean imports/exports |

## How to Run
1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open http://localhost:3000 to view the dashboard.

## Summary

This project demonstrates a clinician-oriented mental health dashboard with:

- Interactive, visually informative charts
- Weekly trend summaries
- Customizable date filters
- Synthetic yet realistic mood data

### SummaryCard – Mood Icons

The `SummaryCard` component displays weekly mood averages with emoji icons for quick interpretation:

| Score Range | Icon | Meaning |
|------------|------|--------|
| 4–5        | 😊    | Positive / Good mood |
| 3–4        | 😐    | Neutral / Average mood |
| 1–3        | ☔️    | Low / Negative mood |

These icons help clinicians quickly identify emotional trends without needing to interpret raw numbers.

#### Notes on Accessibility:
- Each icon is accompanied by the numeric average, so screen readers can still convey the information.
- Color and icon combinations are chosen to be intuitive and distinguishable, even for users with mild color vision deficiencies.

This approach supports mental health monitoring by providing an at-a-glance summary of mood trends, making it easier to identify periods of concern or improvement.