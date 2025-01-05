import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const DifferentLoansView = ({ comparison }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: '#047857',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 600
        }}
      >
        <span role="img" aria-label="checkmark">✅</span>
        Loan Analysis & Recommendation
      </Typography>

      {/* Better Choice Banner */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          p: 2,
          mb: 2,
          border: '1px solid rgba(6, 95, 70, 0.2)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#047857',
            fontWeight: 600,
            textAlign: 'center',
            mb: 1
          }}
        >
          Loan Option {comparison.analysis.betterLoan} is the Better Choice
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#065f46',
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {comparison.analysis.summaryMessage}
        </Typography>
      </Box>

      {/* Total Savings */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          p: 2,
          mb: 2,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#047857',
            fontWeight: 600,
            mb: 1
          }}
        >
          Total Savings Over Loan Term
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#047857',
            fontWeight: 700,
            mb: 1
          }}
        >
          {formatCurrency(comparison.analysis.savings)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#065f46',
            fontWeight: 500
          }}
        >
          Total amount saved
        </Typography>
      </Box>

      {/* Monthly Savings */}
      {comparison.analysis.monthlySavings > 0 && (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            p: 2,
            mb: 2,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#047857',
              fontWeight: 600,
              mb: 1
            }}
          >
            Monthly Savings
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#047857',
              fontWeight: 700,
              mb: 1
            }}
          >
            {formatCurrency(comparison.analysis.monthlySavings)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#065f46',
              fontWeight: 500
            }}
          >
            {formatCurrency(comparison.analysis.yearlySavings)} savings per year
          </Typography>
        </Box>
      )}

      {/* Key Benefits */}
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="body1"
          sx={{
            color: '#065f46',
            fontWeight: 600,
            mb: 1.5
          }}
        >
          Why This Option is Better:
        </Typography>
        {comparison.analysis.reasons.map((reason, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              fontSize: '0.95rem',
              pl: 1
            }}
          >
            <span role="img" aria-label="bullet" style={{ fontSize: '1.2rem' }}>
              💎
            </span>
            {reason}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default DifferentLoansView;
