import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #1e40af 0%, #2563eb 50%, #1e3a8a 100%)',
        p: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'white',
            opacity: 0.1,
            transform: 'rotate(45deg)',
            width: '100%',
            height: '200%',
            left: '-50%',
            top: '-50%'
          }}
        />
      </Box>
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            mb: 1
          }}
        >
          Compare Loan Options
        </Typography>
        <Typography
          sx={{
            color: '#bfdbfe',
            textAlign: 'center',
            fontSize: '1.125rem'
          }}
        >
          Compare different loan options to find the best choice for you
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
