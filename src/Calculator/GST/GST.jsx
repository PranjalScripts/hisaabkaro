import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";

const GST = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [calculationType, setCalculationType] = useState("exclusive");

  const handleAmountChange = (e) => {
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    if (value.split(".").length > 2) return;

    setAmount(value);
  };

  const handleGSTRateChange = (e) => {
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    if (value.split(".").length > 2) return;

    setGstRate(value);
  };

  const handleKeyDown = (e) => {
    // Prevent e, E, +, - keys
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleReset = () => {
    setAmount("");
    setGstRate("18");
    setCalculationType("exclusive");
  };

  const calculateGST = () => {
    const baseAmount = parseFloat(amount) || 0;
    const gstPercentage = parseFloat(gstRate) || 0;

    if (calculationType === "exclusive") {
      const gstAmount = (baseAmount * gstPercentage) / 100;
      const totalAmount = baseAmount + gstAmount;
      return {
        baseAmount: baseAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    } else {
      const baseAmount = (amount * 100) / (100 + gstPercentage);
      const gstAmount = amount - baseAmount;
      return {
        baseAmount: baseAmount.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        totalAmount: amount,
      };
    }
  };

  const { baseAmount, gstAmount, totalAmount } = calculateGST();
  const commonRates = ["0", "5", "12", "18", "28"];

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/calculators")}
        className="fixed top-20 left-4 z-50 text-blue-800 hover:text-blue-900 flex items-center space-x-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
        title="Back to Calculators"
      >
        <span className="text-xl mr-1">←</span>
        <span className="text-lg">Back to Calculators</span>
      </button>

      <div className="max-w-3xl mx-auto px-4 mt-24">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 card-hover">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-[-50%] translate-y-[-50%] w-[200%] h-[200%]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl text-white font-bold text-center mb-2">
                GST Calculator
              </h2>
              <p className="text-blue-100 text-center text-lg">
                Calculate GST amounts instantly and accurately
              </p>
            </div>
          </div>

          {/* Calculator Content */}
          <div className="p-6">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Tooltip
                  title={
                    calculationType === "exclusive"
                      ? "GST will be added to this amount"
                      : "GST will be extracted from this amount"
                  }
                  arrow
                  placement="top"
                >
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Calculation Type</InputLabel>
                    <Select
                      value={calculationType}
                      onChange={(e) => setCalculationType(e.target.value)}
                      label="Calculation Type"
                    >
                      <MenuItem value="exclusive">
                        GST Exclusive (Add GST)
                      </MenuItem>
                      <MenuItem value="inclusive">
                        GST Inclusive (Extract GST)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    calculationType === "exclusive"
                      ? "Base Amount (₹)"
                      : "Total Amount (₹)"
                  }
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  onKeyDown={handleKeyDown}
                  variant="outlined"
                  placeholder="Enter amount"
                  inputProps={{
                    min: "0",
                    inputMode: "decimal",
                    pattern: "[0-9]*",
                    style: {
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    },
                    onKeyDown: handleKeyDown,
                  }}
                  sx={{
                    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: "text.secondary" }}>
                        ₹
                      </Typography>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  GST Rate
                  <Tooltip title="Select or enter custom GST rate" arrow>
                    <HelpOutlineIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  </Tooltip>
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  {commonRates.map((rate) => (
                    <Chip
                      key={rate}
                      label={`${rate}%`}
                      onClick={() => setGstRate(rate)}
                      color={gstRate === rate ? "primary" : "default"}
                      variant={gstRate === rate ? "filled" : "outlined"}
                      sx={{ borderRadius: "8px" }}
                    />
                  ))}
                </Stack>
                <TextField
                  fullWidth
                  label="Custom Rate (%)"
                  type="number"
                  value={gstRate}
                  onChange={handleGSTRateChange}
                  onKeyDown={handleKeyDown}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    min: "0",
                    inputMode: "decimal",
                    pattern: "[0-9]*",
                    style: {
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    },
                    onKeyDown: handleKeyDown,
                  }}
                  sx={{
                    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "grey.50",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="text.secondary">
                          Base Amount:
                        </Typography>
                        <Typography fontWeight="medium">
                          ₹{baseAmount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="text.secondary">
                          GST Amount ({gstRate}%):
                        </Typography>
                        <Typography fontWeight="medium" color="primary.main">
                          ₹{gstAmount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 1,
                          borderTop: "1px dashed",
                          borderColor: "divider",
                        }}
                      >
                        <Typography fontWeight="medium">
                          Total Amount:
                        </Typography>
                        <Typography fontWeight="bold" fontSize="1.1rem">
                          ₹{totalAmount}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Reset Button */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={handleReset}
                    sx={{
                      mt: 2,
                      color: "grey.700",
                      borderColor: "grey.300",
                      "&:hover": {
                        borderColor: "grey.500",
                        backgroundColor: "grey.50",
                      },
                    }}
                  >
                    Reset Calculator
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GST;
