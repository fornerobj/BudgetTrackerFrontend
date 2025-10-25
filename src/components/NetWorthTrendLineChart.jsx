import { Paper, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function NetWorthTrendLineChart({ transactions, dateRange }) {
  // Calculate net worth at the end of each week in the range
  const points = useMemo(() => {
    const points = [];
    let running = 0;
    let current = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const txSorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let txIdx = 0;
    while (current <= end) {
      while (txIdx < txSorted.length && new Date(txSorted[txIdx].date) <= current) {
        running += txSorted[txIdx].amount;
        txIdx++;
      }
      points.push({ x: format(current, 'MMM d'), y: running });
      current.setDate(current.getDate() + 7); // weekly
    }
    return points;
  }, [transactions, dateRange]);

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Net Worth Trend
      </Typography>
      <LineChart
        height={220}
        series={[{ data: points.map((p) => p.y), label: 'Net Worth', color: '#81c784' }]}
        xAxis={[{ data: points.map((p) => p.x), scaleType: 'point' }]}
        grid={{ horizontal: true }}
        margin={{ left: 60, right: 20, top: 30, bottom: 30 }}
      />
    </Paper>
  );
}
