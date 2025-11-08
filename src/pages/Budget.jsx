import { DataGrid } from '@mui/x-data-grid';
import { createCategory } from '../api/categoryApi';
import { useCallback, useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useDateRange } from '../utils/DateRangeProvider';
import { fetchSummaries } from '../api/budgetApi';

export default function Budget() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    budget: '',
  });
  const { dateRange } = useDateRange();

  const loadSummaries = useCallback(() => {
    setLoading(true);
    fetchSummaries({
      dateFrom: dateRange.start.toISOString().slice(0, 10),
      dateTo: dateRange.end.toISOString().slice(0, 10),
    })
      .then(setSummaries)
      .finally(() => setLoading(false));
  }, [dateRange]);

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const handleInputChange = (e) => {
    setNewCategory((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    setLoading(true);
    try {
      await createCategory({
        ...newCategory,
        budget: newCategory.budget ? parseFloat(newCategory.budget) : null,
      });
      setNewCategory({ name: '', description: '', budget: '' });
      loadSummaries();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Category',
      width: 180,
    },
    { field: 'description', headerName: 'Description', width: 600 },
    { field: 'budget', headerName: 'Budget', width: 150, type: 'number' },
    { field: 'spent', headerName: 'Spent', width: 150, type: 'number' },
    { field: 'remaining', headerName: 'Remaining', width: 150, type: 'number' },
  ];

  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <form onSubmit={handleAddCategory}>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Category"
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            size="small"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newCategory.description}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Budget"
            name="budget"
            type="number"
            value={newCategory.budget}
            onChange={handleInputChange}
            size="small"
            slotProps={{
              input: { min: 0, step: 'any' },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !newCategory.name}
          >
            Add Category
          </Button>
        </Stack>
      </form>
      <DataGrid
        rows={summaries}
        columns={columns}
        loading={loading}
        autoPageSize
        getRowId={(row) => row.categoryId}
      />
    </div>
  );
}
