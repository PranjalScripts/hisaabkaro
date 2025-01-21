import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Chip, InputBase, IconButton, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Blogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    "All",
    "Business Finance",
    "Expense Management",
    "Bookkeeping",
    "Tax Tips",
    "Business Growth",
    "Financial Planning"
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for Better Expense Management",
      excerpt: "Learn how to effectively manage your business expenses with these proven strategies...",
      category: "Expense Management",
      author: "Rahul Sharma",
      readTime: "5 min read",
      date: "Jan 15, 2025",
      image: "/blog/expense-management.svg",
      featured: true
    },
    {
      id: 2,
      title: "The Ultimate Guide to Digital Bookkeeping",
      excerpt: "Discover how digital bookkeeping can transform your business and save you valuable time...",
      category: "Bookkeeping",
      author: "Priya Patel",
      readTime: "8 min read",
      date: "Jan 12, 2025",
      image: "/blog/digital-bookkeeping.svg",
      featured: true
    },
    {
      id: 3,
      title: "Tax Season Preparation: What You Need to Know",
      excerpt: "Stay ahead of tax season with our comprehensive guide to preparation and compliance...",
      category: "Tax Tips",
      author: "Amit Kumar",
      readTime: "6 min read",
      date: "Jan 10, 2025",
      image: "/blog/tax-preparation.svg"
    },
    {
      id: 4,
      title: "Growing Your Business: Financial Strategies",
      excerpt: "Expert financial strategies to help your business scale effectively and sustainably...",
      category: "Business Growth",
      author: "Neha Singh",
      readTime: "7 min read",
      date: "Jan 8, 2025",
      image: "/blog/business-growth.svg"
    },
    {
      id: 5,
      title: "Understanding Cash Flow Management",
      excerpt: "Master the basics of cash flow management to keep your business financially healthy...",
      category: "Business Finance",
      author: "Vikram Desai",
      readTime: "5 min read",
      date: "Jan 5, 2025",
      image: "/blog/cash-flow.svg"
    },
    {
      id: 6,
      title: "5 Ways to Optimize Your Business Finances",
      excerpt: "Practical tips and strategies to optimize your business's financial performance...",
      category: "Financial Planning",
      author: "Anjali Gupta",
      readTime: "6 min read",
      date: "Jan 3, 2025",
      image: "/blog/financial-optimization.svg"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
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
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{ fontWeight: 800, mb: 3 }}
            >
              Insights for Better Business Finance
            </Typography>
            <Typography
              variant="h6"
              sx={{ opacity: 0.9, mb: 4 }}
            >
              Expert advice, tips, and strategies to help you manage your business finances more effectively.
            </Typography>
            
            {/* Search Bar */}
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white' }}
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton sx={{ p: '10px', color: 'white' }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
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
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 3 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                bgcolor: selectedCategory === category ? '#1a237e' : 'transparent',
                color: selectedCategory === category ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: selectedCategory === category ? '#1a237e' : 'rgba(0,0,0,0.1)'
                }
              }}
            />
          ))}
        </Paper>
      </Container>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
            Featured Articles
          </Typography>
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <Paper
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: 240,
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{ mb: 2, bgcolor: '#e3f2fd', color: '#1a237e' }}
                    />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#666' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonOutlineIcon fontSize="small" />
                        <Typography variant="body2">{post.author}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">{post.readTime}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* All Posts */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Latest Articles
        </Typography>
        <Grid container spacing={4}>
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Paper
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{ mb: 2, bgcolor: '#e3f2fd', color: '#1a237e' }}
                  />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#666' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonOutlineIcon fontSize="small" />
                      <Typography variant="body2">{post.author}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">{post.readTime}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Blogs;
