import { Box, Paper, Stack, Typography } from '@mui/material';
import { endOfDay, startOfMonth } from 'date-fns';
import { useState } from 'react';
import NetWorthTrendLineChart from '../components/NetWorthTrendLineChart';
import SpendingByCategoryPieChart from '../components/SpendingByCategoryPieChart';
import SpendingVsIncomeBarChart from '../components/SpendingVsIncomeBarChart';
import DateRangePicker from '../components/DateRangePicker';

const mockTransactions = [
  { date: '2025-10-01', amount: 2000, type: 'income', category: 'Salary' },
  { date: '2025-10-03', amount: -100, type: 'spending', category: 'Groceries' },
  { date: '2025-10-05', amount: -50, type: 'spending', category: 'Dining' },
  { date: '2025-10-10', amount: -300, type: 'spending', category: 'Rent' },
  { date: '2025-10-12', amount: 100, type: 'income', category: 'Gift' },
  { date: '2025-09-15', amount: -80, type: 'spending', category: 'Utilities' },
  { date: '2025-09-20', amount: 2000, type: 'income', category: 'Salary' },
  { date: '2025-09-22', amount: -120, type: 'spending', category: 'Groceries' },
  // ...add more for realism
];

export default function Home() {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfDay(new Date()),
  });

  const transactions = mockTransactions;

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, height: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Financial Overview
      </Typography>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <SpendingVsIncomeBarChart transactions={transactions} dateRange={dateRange} />
        <SpendingByCategoryPieChart transactions={transactions} dateRange={dateRange} />
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <NetWorthTrendLineChart transactions={transactions} dateRange={dateRange} />
        {/* Add more charts or summaries here */}
      </Stack>
    </Box>
  );
}
