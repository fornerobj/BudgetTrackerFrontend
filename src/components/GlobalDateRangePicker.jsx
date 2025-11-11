import { useDateRange } from '../utils/DateRangeProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, TextField } from '@mui/material';

export default function GlobalDateRangePicker() {
  const { dateRange, setDateRange } = useDateRange();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DatePicker
          label="Start"
          value={dateRange.start}
          onChange={(newValue) => setDateRange(newValue, dateRange.end)}
          slotProps={{ textField: { size: 'small', variant: 'outlined' } }}
        />
        <DatePicker
          label="End"
          value={dateRange.end}
          onChange={(newValue) => setDateRange(dateRange.start, newValue)}
          slotProps={{ textField: { size: 'small', variant: 'outlined' } }}
        />
      </Box>
    </LocalizationProvider>
  );
}
