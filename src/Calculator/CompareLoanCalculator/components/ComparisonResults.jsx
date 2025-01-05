import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { formatCurrency } from '../utils/formatters';
import IdenticalLoansView from './IdenticalLoansView';
import DifferentLoansView from './DifferentLoansView';

const ComparisonResults = ({ comparison }) => {
  if (!comparison) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd'
      }}
    >
      {comparison.analysis.identical ? (
        <IdenticalLoansView comparison={comparison} />
      ) : (
        <DifferentLoansView comparison={comparison} />
      )}
    </Paper>
  );
};

export default ComparisonResults;
