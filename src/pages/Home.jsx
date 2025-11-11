import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import NetWorthTrendLineChart from '../components/NetWorthTrendLineChart';
import SpendingByCategoryPieChart from '../components/SpendingByCategoryPieChart';
import SpendingVsIncomeBarChart from '../components/SpendingVsIncomeBarChart';
import { fetchTransactions } from '../api/transactionsApi';
import { useDateRange } from '../utils/DateRangeProvider';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  const { dateRange } = useDateRange();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const loadData = async () => {
      setLoading(true);
      const token = await getAccessTokenSilently();
      try {
        const data = await fetchTransactions(token, {
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
  }, [dateRange.start, dateRange.end, getAccessTokenSilently, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          p: { xs: 1, md: 3 },
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome to Budget Tracker
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Sign up or sign in to start tracking your finances.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
          >
            Sign Up
          </Button>
          <Button variant="outlined" color="primary" onClick={() => loginWithRedirect()}>
            Sign In
          </Button>
        </Stack>
      </Box>
    );
  }

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
