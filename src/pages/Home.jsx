import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetWorthTrendLineChart from '../components/NetWorthTrendLineChart';
import SpendingByCategoryPieChart from '../components/SpendingByCategoryPieChart';
import SpendingVsIncomeBarChart from '../components/SpendingVsIncomeBarChart';
import { fetchTransactions } from '../api/transactionsApi';
import { useDateRange } from '../utils/DateRangeProvider';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { dateRange } = useDateRange();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTransactions({
          dateFrom: dateRange.start.toISOString().slice(0, 10),
          dateTo: dateRange.end.toISOString().slice(0, 10),
          excluded: false,
        });
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange.start, dateRange.end]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, height: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Financial Overview
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <SpendingVsIncomeBarChart transactions={transactions} dateRange={dateRange} />
        <SpendingByCategoryPieChart transactions={transactions} dateRange={dateRange} />
      </Stack>
      {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <NetWorthTrendLineChart transactions={transactions} dateRange={dateRange} />
      </Stack> */}
    </Box>
  );
}
