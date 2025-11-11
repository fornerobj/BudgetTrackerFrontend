import { createContext, useCallback, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { endOfMonth, startOfMonth, format, parse } from 'date-fns';

const DateRangeContext = createContext();

function parseLocalDate(str) {
  return parse(str, 'yyyy-MM-dd', new Date());
}

export function DateRangeProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Default range: current month
  const defaultStart = startOfMonth(new Date());
  const defaultEnd = endOfMonth(new Date());

  const start = searchParams.get('start')
    ? parseLocalDate(searchParams.get('start'))
    : defaultStart;
  const end = searchParams.get('end') ? parseLocalDate(searchParams.get('end')) : defaultEnd;

  const setDateRange = useCallback(
    (newStart, newEnd) => {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        start: format(newStart, 'yyyy-MM-dd'),
        end: format(newEnd, 'yyyy-MM-dd'),
      });
    },
    [searchParams, setSearchParams],
  );

  const value = useMemo(
    () => ({
      dateRange: { start, end },
      setDateRange,
    }),
    [start, end, setDateRange],
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDateRange() {
  return useContext(DateRangeContext);
}
