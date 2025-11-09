import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Toolbar,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { uploadTransactionsCsv } from '../api/transactionsApi.js';
import { useAuth0 } from '@auth0/auth0-react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  width: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
});

export default function Upload() {
  const [files, setFiles] = useState([]); // Array<File>
  const [transactions, setTransactions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [errors, setErrors] = useState([]); // { name, message }
  const [globalError, setGlobalError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const abortRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    // Merge new selections with existing (avoid duplicates by name + size + lastModified)
    const existingKey = new Set(files.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
    const merged = [
      ...files,
      ...selected.filter((f) => !existingKey.has(`${f.name}_${f.size}_${f.lastModified}`)),
    ];
    setFiles(merged);
    setGlobalError(null);
  };

  const handleRemoveFile = (name) => {
    if (uploading) return;
    setFiles((f) => f.filter((file) => file.name !== name));
  };

  const handleClearFiles = () => {
    if (uploading) return;
    setFiles([]);
    setErrors([]);
    setCurrentIndex(-1);
  };

  const handleResetAll = () => {
    if (uploading) return;
    setFiles([]);
    setTransactions([]);
    setErrors([]);
    setCurrentIndex(-1);
    setGlobalError(null);
  };

  const uploadSequentially = useCallback(async () => {
    if (files.length === 0) {
      setGlobalError('Please choose one or more CSV files first.');
      return;
    }
    setUploading(true);
    setGlobalError(null);
    setErrors([]);
    setCurrentIndex(-1);

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      setCurrentIndex(i);
      try {
        const token = await getAccessTokenSilently();
        const data = await uploadTransactionsCsv(token, file);
        if (Array.isArray(data)) {
          setTransactions((prev) => [...prev, ...data]);
        } else {
          setErrors((prev) => [...prev, { name: file.name, message: 'Invalid response format' }]);
        }
      } catch (err) {
        setErrors((prev) => [
          ...prev,
          {
            name: file.name,
            message: err?.message || 'Upload failed',
          },
        ]);
      }
    }

    setUploading(false);
    setCurrentIndex(-1);
    abortRef.current = null;
  }, [files, getAccessTokenSilently]);

  // Overall progress (0–100)
  const progress =
    files.length === 0 ? 0 : uploading ? Math.round(((currentIndex + 1) / files.length) * 100) : 0;

  const successfulCount = files.length - errors.length;
  const showProgressBar = uploading && files.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
      }}
    >
      <Paper sx={{ p: 2, mb: 1, display: 'flex', flexDirection: 'column', gap: 2 }} elevation={3}>
        <Typography variant="body1" color="text.secondary">
          Upload one or more CSV files. Each file is parsed and its transactions appended.
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
          >
            {files.length ? 'Add more files' : 'Choose files'}
            <VisuallyHiddenInput
              type="file"
              accept=".csv,text/csv"
              multiple
              onChange={handleFileSelect}
            />
          </Button>

          <Button
            variant="outlined"
            onClick={uploadSequentially}
            disabled={uploading || files.length === 0}
          >
            {uploading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <span>
                  Uploading {currentIndex + 1}/{files.length}
                </span>
              </Stack>
            ) : (
              'Upload All'
            )}
          </Button>

          <Button
            variant="text"
            startIcon={<RefreshIcon />}
            color="secondary"
            onClick={handleResetAll}
            disabled={uploading || (files.length === 0 && transactions.length === 0)}
          >
            Reset All
          </Button>

          <Button
            variant="text"
            color="warning"
            onClick={handleClearFiles}
            disabled={uploading || files.length === 0}
          >
            Clear Files
          </Button>

          {files.length > 0 && !uploading && (
            <Chip
              size="small"
              color="primary"
              label={`${files.length} file${files.length > 1 ? 's' : ''} selected`}
              variant="outlined"
            />
          )}
        </Stack>

        {showProgressBar && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {currentIndex + 1}/{files.length} ({progress}%)
            </Typography>
          </Box>
        )}

        {globalError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {globalError}
          </Alert>
        )}

        {/* File list */}
        {files.length > 0 && (
          <Box
            sx={{
              mt: 1,
              maxHeight: 200,
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
            }}
          >
            <Stack spacing={0.75}>
              {files.map((f, idx) => {
                const err = errors.find((e) => e.name === f.name);
                const isCurrent = uploading && idx === currentIndex;
                return (
                  <Stack
                    key={`${f.name}_${f.lastModified}_${f.size}`}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      fontSize: 13,
                      bgcolor: isCurrent ? 'action.hover' : 'transparent',
                      borderRadius: 0.5,
                      px: 0.5,
                      py: 0.25,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        flexGrow: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={f.name}
                      color={err ? 'error.main' : 'text.primary'}
                    >
                      {f.name}
                    </Typography>
                    {err && (
                      <Chip
                        size="small"
                        color="error"
                        variant="outlined"
                        label="Error"
                        sx={{ fontSize: 10 }}
                      />
                    )}
                    {!err && !uploading && transactions.length > 0 && (
                      <Chip
                        size="small"
                        color="success"
                        variant="outlined"
                        label="Ready"
                        sx={{ fontSize: 10 }}
                      />
                    )}
                    {uploading && isCurrent && (
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Uploading"
                        sx={{ fontSize: 10 }}
                      />
                    )}
                    {!uploading && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(f.name)}
                        disabled={uploading}
                        aria-label={`Remove ${f.name}`}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        )}

        {errors.length > 0 && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            {errors.length} file{errors.length > 1 ? 's' : ''} failed. (Successful:{' '}
            {successfulCount}/{files.length})
          </Alert>
        )}

        {transactions.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Aggregated transactions: {transactions.length}
          </Typography>
        )}

        <Divider sx={{ mt: 2 }} />
        <Typography variant="caption" color="text.secondary">
          Sequential upload avoids overloading the backend; you can parallelize later if needed.
        </Typography>
      </Paper>
    </Box>
  );
}
