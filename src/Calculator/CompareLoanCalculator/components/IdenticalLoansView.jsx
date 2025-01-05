import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const IdenticalLoansView = ({ comparison }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: '#0369a1',
          fontWeight: 600,
          mb: 2
        }}
      >
        Identical Loan Terms
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#0c4a6e',
          mb: 2
        }}
      >
        {comparison.analysis.message}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#0369a1',
            fontWeight: 600,
            mb: 1
          }}
        >
          Loan Details
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#0c4a6e',
            mb: 1
          }}
        >
          EMI: {formatCurrency(comparison.loanA.emi)}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#0c4a6e',
            mb: 1
          }}
        >
          Total Interest: {formatCurrency(comparison.loanA.totalInterest)}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#0c4a6e'
          }}
        >
          Total Payment: {formatCurrency(comparison.loanA.totalPayment)}
        </Typography>
      </Box>
    </Box>
  );
};

export default IdenticalLoansView;
