import React from 'react';
import { Container, Typography, Box, Grid, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import { Link } from 'react-router-dom';
import Footer from './Footer/Footer';

const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mainFeatures = [
    {
      icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />,
      title: "Expense Tracking",
      description: "Effortlessly track every transaction with our intuitive interface. Categorize expenses, add notes, and attach receipts instantly.",
      color: "#2196f3"
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      title: "Smart Bookkeeping",
      description: "Automated bookkeeping that saves time and reduces errors. Let our system handle the complex calculations.",
      color: "#673ab7"
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Multi-User Access",
      description: "Collaborate with your team in real-time. Set permissions and roles to maintain control over your financial data.",
      color: "#4caf50"
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your business finances with powerful analytics and customizable reports.",
      color: "#ff9800"
    }
  ];

  const additionalFeatures = [
    {
      icon: <CloudSyncIcon />,
      title: "Real-Time Sync",
      description: "All your data is synchronized across devices in real-time."
    },
    {
      icon: <NotificationsActiveIcon />,
      title: "Smart Alerts",
      description: "Get notified about important financial events and due dates."
    },
    {
      icon: <SecurityIcon />,
      title: "Bank-Grade Security",
      description: "Your data is protected with enterprise-level security measures."
    },
    {
      icon: <DevicesIcon />,
      title: "Cross-Platform",
      description: "Access your account from any device, anywhere, anytime."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0065ea 0%, #1a237e 100%)',
          color: 'white',
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3
              }}
            >
              Powerful Features for Modern Businesses
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Everything you need to manage your business finances efficiently in one place.
              Built for entrepreneurs, by entrepreneurs.
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#1a237e',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle, ${feature.color}15 0%, transparent 70%)`,
                    borderRadius: '0 0 0 100%'
                  }}
                />
                <Box sx={{ color: feature.color, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Details Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
                Designed for Your Business Needs
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: '#666', mb: 4 }}>
                Our platform is built to scale with your business. Whether you're a small startup or a growing enterprise,
                Hissaab Karo adapts to your needs.
              </Typography>
              <Grid container spacing={3}>
                {additionalFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ color: '#1a237e' }}>
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: 20,
                    bottom: 20,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: 4,
                    zIndex: 1
                  }
                }}
              >
                <Box
                  component="img"
                  src="/features-dashboard.png"
                  alt="Hissaab Karo Dashboard"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#1a237e',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of businesses that trust Hissaab Karo for their financial management.
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#1a237e',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </Container>
        {/* Decorative Background */}
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
      </Box>

      <Footer />
    </div>
  );
};

export default Features;
