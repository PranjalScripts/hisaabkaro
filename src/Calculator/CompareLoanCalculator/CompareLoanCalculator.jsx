import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Components
import Header from './components/Header';
import LoanForm from './components/LoanForm';
import ComparisonResults from './components/ComparisonResults';

// Utils
import { calculateLoanDetails, analyzeLoans } from './utils/calculations';

const CompareLoanCalculator = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage or default values
  const [loanA, setLoanA] = useState(() => {
    const saved = localStorage.getItem('loanA');
    return saved ? JSON.parse(saved) : {
      amount: '',
      interest: '',
      tenure: ''
    };
  });

  const [loanB, setLoanB] = useState(() => {
    const saved = localStorage.getItem('loanB');
    return saved ? JSON.parse(saved) : {
      amount: '',
      interest: '',
      tenure: ''
    };
  });

  const [comparison, setComparison] = useState(() => {
    const saved = localStorage.getItem('comparison');
    return saved ? JSON.parse(saved) : null;
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('loanA', JSON.stringify(loanA));
    localStorage.setItem('loanB', JSON.stringify(loanB));
    if (comparison) {
      localStorage.setItem('comparison', JSON.stringify(comparison));
    }
  }, [loanA, loanB, comparison]);

  const handleReset = () => {
    setLoanA({
      amount: '',
      interest: '',
      tenure: ''
    });
    setLoanB({
      amount: '',
      interest: '',
      tenure: ''
    });
    setComparison(null);
    localStorage.removeItem('loanA');
    localStorage.removeItem('loanB');
    localStorage.removeItem('comparison');
  };

  const handleLoanAChange = (field, value) => {
    setLoanA(prev => ({ ...prev, [field]: value }));
  };

  const handleLoanBChange = (field, value) => {
    setLoanB(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'e' || event.key === 'E' || event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  };

  const validateInputs = () => {
    // Check if any field is empty
    if (!loanA.amount || !loanA.interest || !loanA.tenure ||
        !loanB.amount || !loanB.interest || !loanB.tenure) {
      alert('Please fill in all fields for both loans');
      return false;
    }

    // Check if values are within valid ranges
    if (parseFloat(loanA.amount) <= 0 || parseFloat(loanB.amount) <= 0) {
      alert('Loan amount must be greater than 0');
      return false;
    }

    if (parseFloat(loanA.interest) <= 0 || parseFloat(loanB.interest) <= 0) {
      alert('Interest rate must be greater than 0');
      return false;
    }

    if (parseFloat(loanA.tenure) <= 0 || parseFloat(loanB.tenure) <= 0) {
      alert('Loan tenure must be greater than 0');
      return false;
    }

    return true;
  };

  const handleCompare = () => {
    if (!validateInputs()) return;

    const loanADetails = calculateLoanDetails(loanA);
    const loanBDetails = calculateLoanDetails(loanB);

    const analysis = analyzeLoans(
      { ...loanA, ...loanADetails },
      { ...loanB, ...loanBDetails }
    );

    setComparison({
      loanA: { ...loanA, ...loanADetails },
      loanB: { ...loanB, ...loanBDetails },
      analysis
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: 2,
        background: '#f8fafc'
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          maxWidth: '72rem',
          mx: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            variant="text"
            onClick={() => navigate('/calculator')}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#1e40af',
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'rgba(30, 64, 175, 0.04)'
              }
            }}
          >
            Back to Calculators
          </Button>
        </Box>

        <Paper
          elevation={8}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }
          }}
        >
          <Header />

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Input Section - Full Width */}
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  {/* Loan A Form */}
                  <Grid item xs={12} md={6}>
                    <LoanForm
                      title="Loan Option A"
                      loan={loanA}
                      handleChange={handleLoanAChange}
                      handleKeyDown={handleKeyDown}
                      isHighlighted={comparison?.analysis?.betterLoan === 'A'}
                      isWarning={comparison?.analysis?.betterLoan === 'B'}
                    />
                  </Grid>

                  {/* Loan B Form */}
                  <Grid item xs={12} md={6}>
                    <LoanForm
                      title="Loan Option B"
                      loan={loanB}
                      handleChange={handleLoanBChange}
                      handleKeyDown={handleKeyDown}
                      isHighlighted={comparison?.analysis?.betterLoan === 'B'}
                      isWarning={comparison?.analysis?.betterLoan === 'A'}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleCompare}
                    sx={{
                      px: 8,
                      py: 2,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                      }
                    }}
                  >
                    Compare Loans
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                      px: 8,
                      py: 2,
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      borderColor: '#dc2626',
                      color: '#dc2626',
                      '&:hover': {
                        borderColor: '#dc2626',
                        background: 'rgba(220, 38, 38, 0.04)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>

              {/* Comparison Results */}
              {comparison && (
                <Grid item xs={12}>
                  <ComparisonResults comparison={comparison} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompareLoanCalculator;
