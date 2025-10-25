import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Chip, Box, Typography } from '@mui/material';
import { useMemo } from 'react';

function parseDate(raw) {
  if (!raw) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;

  // yyyy-mm-dd (LocalDate)
  const plainLocalPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (plainLocalPattern.test(raw)) {
    const [y, m, d] = raw.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateDisplay(raw) {
  const d = parseDate(raw);
  if (!d) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(amt) {
  return typeof amt === 'number'
    ? amt.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : amt;
}

function EmptyOverlay() {
  return (
    <GridOverlay>
      <Box
        sx={{
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" fontStyle="italic">
          No transactions loaded
        </Typography>
      </Box>
    </GridOverlay>
  );
}

export function TransactionsGrid({
  rows = [],
  loading = false,
  onRowClick,
  density = 'compact',
  pageSize = 25,
  fill = false,
  minRows = 6,
  rowHeight = 44,
  headerHeight = 56,
  fixedHeight,
}) {
  const processed = useMemo(
    () =>
      rows.map((r, index) => {
        const id = r.id ?? `${r.date || 'na'}-${index}`;
        const dateObj = parseDate(r.date);
        return {
          ...r,
          id,
          dateDisplay: formatDateDisplay(r.date),
          dateSort: dateObj ? dateObj.getTime() : 0,
        };
      }),
    [rows],
  );

  const columns = useMemo(
    () => [
      {
        field: 'dateDisplay',
        headerName: 'Date',
        width: 140,
        sortable: true,
        sortComparator: (v1, v2, param1, param2) =>
          (param1?.row?.dateSort ?? 0) - (param2?.row?.dateSort ?? 0),
        renderCell: (params) =>
          params.value ? (
            params.value
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.55, fontStyle: 'italic' }}>
              (none)
            </Typography>
          ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'category',
        headerName: 'Category',
        width: 140,
        sortable: true,
        renderCell: (params) =>
          params.value ? (
            params.value
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.55, fontStyle: 'italic' }}>
              (none)
            </Typography>
          ),
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 110,
        sortable: true,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        type: 'number',
        width: 130,
        align: 'right',
        headerAlign: 'right',
        valueFormatter: (p) => formatAmount(p.value),
        cellClassName: (p) =>
          typeof p.value === 'number'
            ? p.value < 0
              ? 'tx-amount-negative'
              : 'tx-amount-positive'
            : '',
        sortable: true,
      },
      {
        field: 'excluded',
        headerName: 'Excluded',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (p) =>
          p.value ? (
            <Chip size="small" label="Yes" color="warning" variant="outlined" />
          ) : (
            <Chip size="small" label="No" variant="outlined" />
          ),
        sortable: true,
      },
    ],
    [],
  );

  let containerStyles;
  if (fill) {
    containerStyles = {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: 0, // allow DataGrid internal scroll
      width: '100%',
      '& .tx-amount-negative': { color: 'error.main', fontVariantNumeric: 'tabular-nums' },
      '& .tx-amount-positive': { color: 'success.main', fontVariantNumeric: 'tabular-nums' },
      '& .MuiDataGrid-root': {
        flexGrow: 1,
        // DataGrid root needs an explicit minHeight to not collapse when no rows
        minHeight: headerHeight + minRows * rowHeight,
      },
      '& .MuiDataGrid-cell': { outline: 'none !important' },
    };
  } else {
    // existing fallback: static/dynamic height based on rows
    const computedHeight =
      fixedHeight ?? headerHeight + Math.max(minRows, processed.length) * rowHeight;
    containerStyles = {
      height: computedHeight,
      width: '100%',
      position: 'relative',
      '& .tx-amount-negative': { color: 'error.main', fontVariantNumeric: 'tabular-nums' },
      '& .tx-amount-positive': { color: 'success.main', fontVariantNumeric: 'tabular-nums' },
      '& .MuiDataGrid-cell': { outline: 'none !important' },
    };
  }

  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={processed}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        onRowClick={onRowClick ? (params) => onRowClick(params.row) : undefined}
        density={density}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        initialState={{
          sorting: { sortModel: [{ field: 'dateDisplay', sort: 'desc' }] },
          pagination: { paginationModel: { page: 0, pageSize } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{
          noRowsOverlay: EmptyOverlay,
          noResultsOverlay: EmptyOverlay,
        }}
        sx={{
          '--DataGrid-containerBackground': 'transparent',
          backgroundColor: 'background.paper',
          border: 'none',
          '& .MuiDataGrid-main': fill ? { flexGrow: 1, minHeight: 0 } : undefined,
        }}
      />
    </Box>
  );
}
