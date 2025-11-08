import { DataGrid, GridFilterInputSingleSelect } from '@mui/x-data-grid';
import { fetchTransactions, updateTransaction } from '../api/transactionsApi';
import { useCallback, useEffect, useState } from 'react';
import { Autocomplete, Button, MenuItem, Select, Stack, TextField } from '@mui/material';
import { fetchCategories } from '../api/categoryApi';
import { useDateRange } from '../utils/DateRangeProvider';

const CATEGORY_OPTIONS = [
  'Groceries',
  'Dining',
  'Utilities',
  'Rent',
  'Salary',
  'Entertainment',
  'Travel',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dateRange } = useDateRange();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions({
        dateFrom: dateRange.start.toISOString().slice(0, 10),
        dateTo: dateRange.end.toISOString().slice(0, 10),
      });
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleToggleExcluded = async (id, currentValue) => {
    setLoading(true);
    try {
      await updateTransaction(id, { excluded: !currentValue });
      await loadData();
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (id, newCategory) => {
    setLoading(true);
    try {
      await updateTransaction(id, { categoryId: newCategory ? newCategory.id : -1 });
      await loadData();
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transaction example:
  // amount: -10.81
  // category: null
  // date: "2025-08-14"
  // description: "PAYPAL *APPLE.COM/BILL 888-221-1161 CA"
  // excluded: false
  // id: 1
  // type: null
  const columns = [
    { field: 'amount', headerName: 'Amount', width: 100 },
    {
      field: 'category',
      headerName: 'Category',
      width: 230,
      renderCell: (params) => (
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option?.name || ''}
          value={categories.find((cat) => cat.id === params.row.category?.id) || null}
          onChange={(_, newValue) => {
            handleCategoryChange(params.row.id, newValue);
          }}
          renderInput={(inputParams) => (
            <TextField {...inputParams} label="Category" size="small" sx={{ marginTop: '5px' }} />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={loading}
          sx={{
            minWidth: 160,
            height: 1, // 100% of cell height
          }}
        />
      ),
    },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'description', headerName: 'Description', width: 600 },
    { field: 'type', headerName: 'Type', width: 200 },
    { field: 'excluded', headerName: 'Excluded', width: 100 },
    {
      field: 'toggleExcluded',
      headerName: 'Toggle Excluded',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleToggleExcluded(params.row.id, params.row.excluded)}
          disabled={loading}
        >
          {params.row.excluded ? 'Include' : 'Exclude'}
        </Button>
      ),
    },
  ];
  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <DataGrid rows={transactions} columns={columns} loading={loading} autoPageSize />
    </div>
  );
}
