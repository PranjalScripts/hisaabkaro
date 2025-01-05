import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const LoanAnalysis = ({ comparison }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '16px',
        border: '1px solid #bae6fd',
        p: 3,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(6, 95, 70, 0.1)'
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 600
        }}
      >
        <span role="img" aria-label="checkmark">✅</span>
        Loan Analysis & Recommendation
      </Typography>

      {/* Total Savings */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          p: 2,
          mb: 2,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#0369a1',
            fontWeight: 600,
            mb: 1
          }}
        >
          Total Savings Over Loan Term
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#0369a1',
            fontWeight: 700,
            mb: 1
          }}
        >
          {formatCurrency(comparison.analysis.savings)}
        </Typography>
      </Box>

      {/* Monthly Savings */}
      {comparison.analysis.monthlySavings > 0 && (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            p: 2,
            mb: 2,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#0369a1',
              fontWeight: 600,
              mb: 1
            }}
          >
            Monthly & Yearly Savings
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#0369a1',
              fontWeight: 700,
              mb: 1
            }}
          >
            {formatCurrency(comparison.analysis.monthlySavings)} / month
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#0c4a6e',
              fontWeight: 500
            }}
          >
            {formatCurrency(comparison.analysis.yearlySavings)} per year
          </Typography>
        </Box>
      )}

      {/* Comparison Details */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          p: 2,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#0369a1',
            fontWeight: 600,
            mb: 2
          }}
        >
          Detailed Comparison
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="#0c4a6e">EMI Difference:</Typography>
          <Typography color="#0c4a6e" fontWeight={500}>
            {formatCurrency(Math.abs(comparison.loanA.emi - comparison.loanB.emi))}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="#0c4a6e">Interest Difference:</Typography>
          <Typography color="#0c4a6e" fontWeight={500}>
            {formatCurrency(Math.abs(comparison.loanA.totalInterest - comparison.loanB.totalInterest))}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="#0c4a6e">Total Payment Difference:</Typography>
          <Typography color="#0c4a6e" fontWeight={500}>
            {formatCurrency(Math.abs(comparison.loanA.totalPayment - comparison.loanB.totalPayment))}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoanAnalysis;
