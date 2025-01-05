import { useState } from 'react';

export const useEmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState("months");
  const [processingFee, setProcessingFee] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Prevent invalid input and negative values
  const preventInvalidInput = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  // Handle number input with validation
  const handleNumberInput = (value, setter) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Only update if the value is non-negative
    if (!isNaN(formattedValue) && Number(formattedValue) >= 0) {
      setter(formattedValue);
    }
  };

  return {
    principal,
    interestRate,
    tenure,
    tenureType,
    processingFee,
    isCalculating,
    setPrincipal,
    setInterestRate,
    setTenure,
    setTenureType,
    setProcessingFee,
    setIsCalculating,
    handleNumberInput,
    preventInvalidInput,
  };
};
