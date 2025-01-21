import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Paper, useTheme, useMediaQuery, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import UpdateIcon from '@mui/icons-material/Update';
import Footer from './Footer';

const Privacy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('1. Introduction');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Intersection Observer callback
  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  useEffect(() => {
    // Create observer for sections
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.3]
    });

    // Observe all section elements
    sections.forEach(section => {
      const element = document.getElementById(section.title);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(sectionId);
    if (isMobile) setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const NavigationContent = () => (
    <Box sx={{ p: 3, width: isMobile ? '100%' : '250px' }}>
      {isMobile && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            mb: 2 
          }}
        >
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, color: '#1a237e' }}>
            Quick Navigation
          </Typography>
        </Box>
      )}
      {!isMobile && (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
          Quick Navigation
        </Typography>
      )}
      {sections.map((section) => (
        <Box
          key={section.title}
          onClick={() => handleSectionClick(section.title)}
          sx={{
            mb: 2,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiTypography-root': { color: '#1a237e' },
              '& .MuiBox-root': { width: '100%' },
              transform: 'translateX(8px)'
            }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              py: 1,
              pl: 2,
              fontWeight: activeSection === section.title ? 600 : 400,
              color: activeSection === section.title ? '#1a237e' : '#666',
              transition: 'all 0.3s ease'
            }}
          >
            {section.title}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              width: activeSection === section.title ? '100%' : '0%',
              bgcolor: '#1a237e',
              transition: 'width 0.3s ease'
            }}
          />
          {activeSection === section.title && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '70%',
                bgcolor: '#1a237e',
                borderRadius: '0 2px 2px 0'
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          zIndex: 1000,
          background: `linear-gradient(to right, #0065ea ${scrollProgress}%, transparent 0)`
        }}
      />

      {/* Header */}
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
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Your privacy is our top priority. Learn how we protect and manage your data.
            </Typography>
          </Box>
        </Container>
        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            width: { xs: '150px', sm: '300px' },
            height: { xs: '150px', sm: '300px' },
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
            width: { xs: '100px', sm: '200px' },
            height: { xs: '100px', sm: '200px' },
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: -6,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          {/* Navigation - Desktop */}
          {!isMobile && (
            <Box
              sx={{
                width: '250px',
                flexShrink: 0,
                position: 'sticky',
                top: '2rem',
                alignSelf: 'flex-start',
                height: 'calc(100vh - 4rem)',
                overflowY: 'auto',
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 0 20px rgba(0,0,0,0.05)'
              }}
            >
              <NavigationContent />
            </Box>
          )}

          {/* Mobile Navigation Toggle */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                bgcolor: '#1a237e',
                color: 'white',
                '&:hover': { bgcolor: '#3949ab' },
                zIndex: 1000
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 0 20px rgba(0,0,0,0.05)'
              }}
            >
              {sections.map((section, index) => (
                <Box
                  key={section.title}
                  id={section.title}
                  sx={{
                    mb: 6,
                    scrollMarginTop: '80px'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      pb: 2,
                      borderBottom: '2px solid #e3f2fd'
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#1a237e'
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#424242',
                      lineHeight: 1.8,
                      '& ul': {
                        listStyle: 'none',
                        pl: 0,
                        '& li': {
                          position: 'relative',
                          pl: 4,
                          pb: 2,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#1a237e'
                          }
                        }
                      }
                    }}
                  >
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <React.Fragment key={i}>
                        {paragraph.startsWith('•') ? (
                          <ul>
                            {paragraph.split('•').filter(Boolean).map((item, j) => (
                              <li key={j}>{item.trim()}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                      </React.Fragment>
                    ))}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80%',
              maxWidth: '300px',
              bgcolor: 'white'
            }
          }}
        >
          <NavigationContent />
        </Drawer>
      </Container>

      <Footer />
    </div>
  );
};

// Privacy policy sections data
const sections = [
  {
    title: "1. Introduction",
    content: "Welcome to Hissaab Karo. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our expense management application."
  },
  {
    title: "2. Information We Collect",
    content: "We collect and process the following information:\n\n• Personal identification information (name, email address, phone number)\n• Business information (business name, type, and address)\n• Financial information (transaction records, payment details)\n• Usage data (how you interact with our application)\n• Device information (IP address, browser type, device type)"
  },
  {
    title: "3. How We Use Your Information",
    content: "We use your information to:\n\n• Provide and maintain our services\n• Process your transactions\n• Send you important updates and notifications\n• Improve our services\n• Comply with legal obligations\n• Prevent fraudulent activities"
  },
  {
    title: "4. Data Security",
    content: "We implement appropriate security measures to protect your personal information. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the internet is 100% secure."
  },
  {
    title: "5. Data Sharing and Disclosure",
    content: "We do not sell your personal information. We may share your data with:\n\n• Service providers who assist in our operations\n• Legal authorities when required by law\n• Business partners with your consent"
  },
  {
    title: "6. Your Rights",
    content: "You have the right to:\n\n• Access your personal data\n• Correct inaccurate data\n• Request deletion of your data\n• Object to processing of your data\n• Data portability\n• Withdraw consent"
  },
  {
    title: "7. Cookies and Tracking",
    content: "We use cookies and similar tracking technologies to improve user experience and analyze application usage. You can control cookie settings through your browser preferences."
  },
  {
    title: "8. Changes to Privacy Policy",
    content: "We may update this privacy policy periodically. We will notify you of any material changes through our application or via email."
  }
];

export default Privacy;