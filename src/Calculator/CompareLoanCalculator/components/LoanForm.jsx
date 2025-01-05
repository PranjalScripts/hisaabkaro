import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
} from '@mui/material';

const LoanForm = ({ 
  title, 
  loan, 
  handleChange, 
  handleKeyDown, 
  isHighlighted, 
  isWarning 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
        ...(isHighlighted && {
          border: '2px solid #047857',
          boxShadow: '0 0 15px rgba(6, 95, 70, 0.2)'
        }),
        ...(isWarning && {
          border: '2px solid #dc2626',
          boxShadow: '0 0 15px rgba(220, 38, 38, 0.2)'
        }),
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: '#1e40af',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Loan Amount"
          type="number"
          value={loan.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          InputProps={{
            inputProps: { 
              min: 0,
              style: {
                MozAppearance: 'textfield',
                '&::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '&::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1e40af',
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              '& input[type=number]': {
                '-moz-appearance': 'textfield',
              },
            },
          }}
        />

        <TextField
          label="Interest Rate (%)"
          type="number"
          value={loan.interest}
          onChange={(e) => handleChange('interest', e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          InputProps={{
            inputProps: { 
              min: 0,
              style: {
                MozAppearance: 'textfield',
                '&::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '&::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1e40af',
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              '& input[type=number]': {
                '-moz-appearance': 'textfield',
              },
            },
          }}
        />

        <TextField
          label="Loan Tenure (Years)"
          type="number"
          value={loan.tenure}
          onChange={(e) => handleChange('tenure', e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          InputProps={{
            inputProps: { 
              min: 0,
              style: {
                MozAppearance: 'textfield',
                '&::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '&::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1e40af',
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              '& input[type=number]': {
                '-moz-appearance': 'textfield',
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default LoanForm;
