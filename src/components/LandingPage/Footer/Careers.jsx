import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button, useTheme, useMediaQuery } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleIcon from '@mui/icons-material/People';
import InstagramIcon from '@mui/icons-material/Instagram';
import Footer from './Footer';

const Careers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const benefits = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities with access to online courses and workshops'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Collaborative Culture',
      description: 'Work with talented individuals in a supportive environment'
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible working hours'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Prime Location',
      description: 'Modern office spaces in prime locations with great amenities'
    }
  ];

  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote/Delhi',
      type: 'Full-time',
      icon: <CodeIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Delhi',
      type: 'Full-time',
      icon: <BusinessCenterIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Content Writer',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      icon: <LocalLibraryIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'HR Manager',
      department: 'Human Resources',
      location: 'Delhi',
      type: 'Full-time',
      icon: <PeopleIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Digital Marketer',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      icon: <LocalLibraryIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Software Development Engineer (SDE)',
      department: 'Engineering',
      location: 'Remote/Delhi',
      type: 'Full-time',
      icon: <CodeIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Sales Executive',
      department: 'Sales',
      location: 'Delhi',
      type: 'Full-time',
      icon: <BusinessCenterIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    },
    {
      title: 'Social Media Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      icon: <InstagramIcon sx={{ fontSize: 30, color: '#1a237e' }} />
    }
  ];

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
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3
              }}
            >
              Join Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                mb: 4
              }}
            >
              Be part of a team that's revolutionizing financial management. We're always looking for talented individuals to join our mission.
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 6,
          mt: { xs: -6, md: -12 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(180deg, rgba(26,35,126,0.03) 0%, rgba(26,35,126,0) 100%)',
            zIndex: -1
          }
        }}
      >
        {/* Benefits Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 4, textAlign: 'center' }}>
            Why Join Us?
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(26,35,126,0.05)'
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: '#1a237e', fontWeight: 600 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Open Positions Section */}
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 4, textAlign: 'center' }}>
            Open Positions
          </Typography>
          <Grid container spacing={3}>
            {openPositions.map((position, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        mr: 2,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(26,35,126,0.05)'
                      }}
                    >
                      {position.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                        {position.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {position.department} · {position.location} · {position.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      '&:hover': {
                        borderColor: '#1a237e',
                        bgcolor: 'rgba(26,35,126,0.05)'
                      }
                    }}
                  >
                    Apply Now
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Footer />
    </div>
  );
};

export default Careers;
