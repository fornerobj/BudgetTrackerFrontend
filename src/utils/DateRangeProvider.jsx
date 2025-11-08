import { createContext, useContext, useState } from 'react';

const DateRangeContext = createContext();

function getDefaultMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
}

export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState(getDefaultMonthRange());
  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDateRange() {
  return useContext(DateRangeContext);
}
