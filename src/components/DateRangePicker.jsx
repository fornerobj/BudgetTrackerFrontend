import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { startOfMonth, endOfMonth, startOfYear, endOfDay, subMonths, format } from 'date-fns';
import { useState } from 'react';

export default function DateRangePicker({ value, onChange }) {
  // value: { start: Date, end: Date }
  const [quick, setQuick] = useState('month');

  const handleQuickPick = (pick) => {
    setQuick(pick);
    let now = new Date();
    if (pick === 'ytd') {
      onChange({ start: startOfYear(now), end: endOfDay(now) });
    } else if (pick === 'month') {
      onChange({ start: startOfMonth(now), end: endOfDay(now) });
    } else if (pick === 'lastmonth') {
      const lastMonth = subMonths(now, 1);
      onChange({ start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) });
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <ToggleButtonGroup
        value={quick}
        exclusive
        onChange={(_, v) => v && handleQuickPick(v)}
        size="small"
      >
        <ToggleButton value="ytd">Year to Date</ToggleButton>
        <ToggleButton value="month">This Month</ToggleButton>
        <ToggleButton value="lastmonth">Last Month</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" color="text.secondary">
        {format(value.start, 'MMM d, yyyy')} - {format(value.end, 'MMM d, yyyy')}
      </Typography>
    </Stack>
  );
}
