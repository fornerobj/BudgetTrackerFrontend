import { Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { useMemo } from 'react';

export default function SpendingByCategoryPieChart({ transactions }) {
  const data = useMemo(() => {
    const catTotals = {};
    transactions.forEach((t) => {
      const catName = t.category?.name || 'Uncategorized';
      catTotals[catName] = (catTotals[catName] || 0) + -t.amount;
    });
    return Object.entries(catTotals).map(([cat, value]) => ({ id: cat, value, label: cat }));
  }, [transactions]);

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Spending by Category
      </Typography>
      <PieChart
        height={400}
        series={[
          {
            data,
            innerRadius: 40,
            outerRadius: 90,
            paddingAngle: 2,
            cornerRadius: 3,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { additionalRadius: -10, color: 'gray' },
          },
        ]}
        slotProps={{
          legend: {
            hidden: false,
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
          },
        }}
      />
    </Paper>
  );
}
