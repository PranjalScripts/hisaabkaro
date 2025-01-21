import React from 'react';
import { Container, Typography, Box, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupIcon from '@mui/icons-material/Group';
import Footer from './Footer';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure & Reliable",
      description: "Bank-grade security for your financial data with end-to-end encryption and regular backups."
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Fast & Efficient",
      description: "Lightning-fast transactions and real-time updates keep your business running smoothly."
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: "Cross-Platform",
      description: "Access your accounts from any device - desktop, tablet, or mobile phone."
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Collaborative",
      description: "Work together with your team in real-time, share reports, and manage permissions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Transforming Business Finance Management
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Hissaab Karo is revolutionizing how businesses manage their expenses, 
                making financial tracking simpler, faster, and more efficient than ever before.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/about-hero.png"
                alt="Hissaab Karo Dashboard"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: isMobile ? 'none' : 'perspective(1000px) rotateY(-10deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </Grid>
          </Grid>
        </Container>
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
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

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: '#424242', mb: 4 }}>
              At Hissaab Karo, we're on a mission to simplify financial management for businesses of all sizes. 
              We understand the challenges that come with managing expenses, tracking transactions, and maintaining 
              accurate financial records.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#424242' }}>
              Our platform is designed to eliminate these pain points, providing you with powerful tools that make 
              financial management intuitive and efficient. We believe that every business deserves access to 
              professional-grade financial tools without the complexity.
            </Typography>
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
                src="/mission.png"
                alt="Our Mission"
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

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, color: '#1a237e', mb: 8 }}
          >
            Why Choose Hissaab Karo?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: 'white',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ color: '#1a237e', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: '#1a237e', mb: 2 }}
        >
          Our Team
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: '#666', mb: 8, maxWidth: 800, mx: 'auto' }}
        >
          We're a dedicated team of professionals committed to making financial management easier for businesses.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[1, 2, 3].map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={`/team-member-${member}.png`}
                  alt={`Team Member ${member}`}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    mb: 2,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                  }}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Team Member {member}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Position
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default About;
