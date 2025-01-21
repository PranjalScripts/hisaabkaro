import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Footer from './Footer';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              We would love to hear from you! Please fill out the form below or contact us using the information provided.
            </Typography>
          </Box>
        </Container>
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            transform: 'translateY(-50%)',
            borderRadius: '50%'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                Send Us a Message
              </Typography>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: '#1a237e', '&:hover': { bgcolor: '#3949ab' } }}
                  fullWidth
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ color: '#1a237e', mr: 2 }} />
                <Typography variant="body2">
                  88, Sant Nagar, Near India Post Office, East of Kailash, New Delhi 110065, INDIA
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <PhoneIcon sx={{ color: '#1a237e', mr: 2 }} />
  <Typography 
    variant="body2" 
    component="a" 
    href="tel:+919015662728" 
    sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
  >
    +91 9015-6627-28
  </Typography>
</Box>
<Box sx={{ display: 'flex', alignItems: 'center' }}>
  <PhoneIcon sx={{ color: '#1a237e', mr: 2 }} />
  <Typography 
    variant="body2" 
    component="a" 
    href="tel:+919675967509" 
    sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
  >
    +91 9675-9675-09
  </Typography>
</Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
  <EmailIcon sx={{ color: '#1a237e', mr: 2 }} />
  <Typography 
    variant="body2" 
    component="a" 
    href="mailto:support@hisaabkaro.com" 
    sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
  >
    support@hisaabkaro.com
  </Typography>
</Box>

            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default ContactUs;
