import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Typography,
  Container,
  Box,
  useTheme,
  Paper,
  IconButton,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PercentIcon from "@mui/icons-material/Percent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const calculatorOptions = [
  {
    title: "Basic Calculator",
    icon: <CalculateIcon sx={{ fontSize: 50 }} />,
    path: "/calculator/basic",
    description:
      "Your everyday companion for quick calculations. Add, subtract, multiply, and divide with ease.",
    subtitle: "Simple & Fast",
  },
  {
    title: "EMI Calculator",
    icon: <AccountBalanceIcon sx={{ fontSize: 50 }} />,
    path: "/calculator/emi",
    description:
      "Plan your loans better. Calculate monthly EMI, total interest, and analyze your loan repayment schedule.",
    subtitle: "Smart Loan Planning",
  },
  {
    title: "Compare Loan",
    icon: <CompareArrowsIcon sx={{ fontSize: 50 }} />,
    path: "/calculator/compare-loan",
    description:
      "Compare different loan offers side by side. Make informed decisions about interest rates and terms.",
    subtitle: "Make Better Choices",
  },
  {
    title: "Percentage Calculator",
    icon: <PercentIcon sx={{ fontSize: 50 }} />,
    path: "/calculator/percentage",
    description:
      "Calculate percentages, discounts, tax rates, and more with our intuitive percentage tool.",
    subtitle: "Quick & Accurate",
  },
  {
    title: "GST Calculator",
    icon: <CreditCardIcon sx={{ fontSize: 50 }} />,
    path: "/calculator/gst",
    description:
      "Calculate GST amount and total price with different tax rates. Perfect for business calculations.",
    subtitle: "Tax Made Easy",
  },
];

const Calculator = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            background: "rgba(240, 249, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            p: { xs: 3, md: 6 },
            mb: 6,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(240, 249, 255, 0.4) 0%, rgba(224, 242, 254, 0.2) 100%)",
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: "#2563eb",
                mb: 4,
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
                letterSpacing: "-0.02em",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Simplify Your <br />
              Financial Calculations
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                mb: 3,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                color: "#475569",
                textAlign: "center",
                letterSpacing: "-0.01em",
              }}
            >
              Your all-in-one toolkit for smart financial decisions. From basic
              math to complex loan comparisons, we make number-crunching
              effortless.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                color: "#64748b",
                fontSize: { xs: "1rem", md: "1.1rem" },
                textAlign: "center",
                mb: 6,
                lineHeight: 1.7,
              }}
            >
              Select your calculator and experience the perfect blend of
              simplicity and precision. Built for everyone, from students to
              financial professionals.
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {calculatorOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={3} key={option.title}>
              <Card
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  height: "360px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease-in-out",
                  borderRadius: "16px",
                  border:
                    hoveredCard === index
                      ? "2px solid #60a5fa"
                      : "1px solid rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    "& .icon-container": {
                      background: "#60a5fa",
                      color: "#ffffff",
                      transform: "scale(1.1)",
                    },
                    "& .card-title": {
                      color: "#2563eb",
                    },
                    "& .arrow-icon": {
                      opacity: 1,
                      transform: "translateX(5px)",
                      color: "#2563eb",
                    },
                  },
                }}
                onClick={() => navigate(option.path)}
              >
                <Box
                  className="icon-container"
                  sx={{
                    color: "#64748b",
                    background: "rgba(241, 245, 249, 0.7)",
                    backdropFilter: "blur(5px)",
                    mb: 3,
                    transition: "all 0.3s ease-in-out",
                    p: 2.5,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {option.icon}
                </Box>
                <Box
                  className="card-content"
                  sx={{
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Typography
                    className="card-title"
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      color: "#1e293b",
                      fontWeight: 700,
                      mb: 1,
                      transition: "color 0.3s ease-in-out",
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#475569",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {option.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      maxWidth: "240px",
                      mx: "auto",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                      mb: 2,
                    }}
                  >
                    {option.description}
                  </Typography>
                  <IconButton
                    className="arrow-icon"
                    sx={{
                      color: "#94a3b8",
                      opacity: 0,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        background: "rgba(239, 246, 255, 0.7)",
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Calculator;
