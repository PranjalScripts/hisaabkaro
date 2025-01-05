import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LoanRecommendation = ({ comparison }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
        borderRadius: '16px',
        border: '1px solid #6ee7b7',
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
          mb: 3,
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
          Choose Loan Option {comparison.analysis.betterLoan}
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

      {/* Key Benefits */}
      <Box>
        <Typography
          variant="body1"
          sx={{
            color: '#065f46',
            fontWeight: 600,
            mb: 2
          }}
        >
          Key Advantages:
        </Typography>
        {comparison.analysis.reasons.map((reason, index) => (
          <Box
            key={index}
            sx={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              p: 2,
              mb: index !== comparison.analysis.reasons.length - 1 ? 2 : 0
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#047857',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.95rem'
              }}
            >
              <span role="img" aria-label="bullet" style={{ fontSize: '1.2rem' }}>
                💎
              </span>
              {reason}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default LoanRecommendation;
