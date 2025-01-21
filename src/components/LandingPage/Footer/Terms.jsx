import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Paper, Grid, useTheme, useMediaQuery, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import BlockIcon from '@mui/icons-material/Block';
import PaymentIcon from '@mui/icons-material/Payment';
import UpdateIcon from '@mui/icons-material/Update';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import Footer from './Footer';

const Terms = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('1. Acceptance of Terms');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using Hissaab Karo's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.

These terms constitute a legally binding agreement between you and Hissaab Karo regarding your use of our financial management platform and related services.`
    },
    {
      title: '2. User Accounts',
      content: `To access our services, you must create an account. You agree to:
• Provide accurate and complete information
• Maintain the security of your account credentials
• Promptly update any changes to your information
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized access

You must be at least 18 years old to create an account. Business accounts must be created by authorized representatives.`
    },
    {
      title: '3. Service Usage',
      content: `Our services are provided for legitimate business financial management purposes. You agree to:
• Use the services in compliance with all applicable laws
• Not misuse or attempt to manipulate our systems
• Not interfere with other users' access to the services
• Not use the services for any illegal activities
• Maintain accurate and up-to-date financial records

We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: '4. Data and Privacy',
      content: `We take data protection seriously. By using our services, you acknowledge that:
• We collect and process data as described in our Privacy Policy
• You retain ownership of your financial data
• We implement security measures to protect your information
• You are responsible for backing up your data
• We may use anonymized data for service improvement

For complete information about data handling, please refer to our Privacy Policy.`
    },
    {
      title: '5. Prohibited Activities',
      content: `The following activities are strictly prohibited:
• Unauthorized access or attempts to access other users' accounts
• Uploading malicious code or attempting to breach our security
• Using the service for money laundering or illegal activities
• Sharing account credentials with unauthorized users
• Violating any applicable laws or regulations
• Attempting to reverse engineer our software

Violation of these prohibitions may result in immediate account termination.`
    },
    {
      title: '6. Payments and Billing',
      content: `For paid services:
• Payments are processed securely through our payment partners
• Subscriptions are automatically renewed unless cancelled
• Refunds are provided according to our refund policy
• Prices may be updated with prior notice
• Users are responsible for applicable taxes
• Failed payments may result in service interruption

Detailed pricing information is available on our pricing page.`
    },
    {
      title: '7. Intellectual Property',
      content: `All content and materials available through our services are protected by intellectual property rights:
• Our software, logos, and trademarks are our exclusive property
• Users retain rights to their financial data
• You may not copy or modify our software without permission
• Service feedback may be used for improvements
• Third-party services may have separate IP rights

Any unauthorized use of our intellectual property is strictly prohibited.`
    },
    {
      title: '8. Limitation of Liability',
      content: `To the extent permitted by law:
• We provide the service "as is" without warranties
• We are not liable for indirect or consequential damages
• Our liability is limited to the amount paid for services
• We do not guarantee uninterrupted service
• Users are responsible for their financial decisions
• Force majeure events may affect service availability

These limitations protect our ability to provide services at reasonable costs.`
    },
    {
      title: '9. Modifications to Terms',
      content: `We reserve the right to modify these terms:
• Changes will be announced in advance
• Continued use constitutes acceptance of changes
• Major changes will be notified via email
• Users may terminate service if they disagree with changes
• Archive of previous terms is available upon request

It is your responsibility to review terms periodically.`
    },
    {
      title: '10. Contact Information',
      content: `For questions about these terms:
• Email: support@hissaabkaro.com
• Visit: www.hissaabkaro.com/contact
• Write to: [Your Business Address]

We strive to respond to all inquiries within 48 business hours.`
    }
  ];

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

  const NavigationContent = () => (
    <Box sx={{ p: 3, width: isMobile ? '100%' : '250px' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
        Quick Navigation
      </Typography>
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
    <div className="min-h-screen bg-gray-50">
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
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3
              }}
            >
              Terms of Use
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
              Please read these terms carefully before using our services. These terms outline your rights and responsibilities while using Hisaab Karo.
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

      {/* Mobile Navigation Toggle */}
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            bgcolor: '#1a237e',
            color: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            '&:hover': { bgcolor: '#3949ab' }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: '300px',
            bgcolor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <NavigationContent />
      </Drawer>

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
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          {/* Sidebar Navigation */}
          {!isMobile && (
            <Box sx={{ width: '250px', flexShrink: 0 }}>
              <Box sx={{ 
                position: 'sticky', 
                top: 100,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
                transition: 'all 0.3s ease',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px'
                }
              }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <NavigationContent />
                </Paper>
              </Box>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ flex: 1 }}>
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
              {sections.map((section) => (
                <Box
                  key={section.title}
                  id={section.title}
                  sx={{
                    mb: 6,
                    scrollMarginTop: '100px',
                    '&:not(:last-child)': {
                      pb: 4,
                      borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        mr: 2,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(26,35,126,0.1)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {section.title.includes('Acceptance') && <GavelIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('User Accounts') && <PersonIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Service Usage') && <SettingsIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Data') && <SecurityIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Prohibited') && <BlockIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Payments') && <PaymentIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Intellectual') && <DescriptionIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Limitation') && <GavelIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Modifications') && <UpdateIcon sx={{ color: '#1a237e' }} />}
                      {section.title.includes('Contact') && <EmailIcon sx={{ color: '#1a237e' }} />}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {section.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#444',
                      lineHeight: 1.7,
                      pl: 7
                    }}
                  >
                    {section.content}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Terms;
