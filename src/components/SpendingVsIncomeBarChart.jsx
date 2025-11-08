import { Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts';

export default function SpendingVsIncomeBarChart({ transactions, dateRange }) {
  const { income, spending } = useMemo(() => {
    let income = 0,
      spending = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d >= dateRange.start && d <= dateRange.end) {
        if (t.amount > 0) income += t.amount;
        else spending += -t.amount;
      }
    });
    return { income, spending };
  }, [transactions, dateRange]);

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Spending vs. Income
      </Typography>
      <BarChart
        height={400}
        series={[
          { data: [spending], label: 'Spending', color: '#e57373' },
          { data: [income], label: 'Income', color: '#64b5f6' },
        ]}
        xAxis={[{ data: [''], scaleType: 'band' }]}
        grid={{ horizontal: true }}
        margin={{ left: 60, right: 20, top: 30, bottom: 30 }}
      />
    </Paper>
  );
}
