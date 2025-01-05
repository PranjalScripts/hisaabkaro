export const formatCurrency = (amount) => {
  if (!amount) return '0.00';
  // First round to 2 decimal places
  const roundedAmount = Math.round(amount * 100) / 100;
  // Then format with exactly 2 decimal places
  return roundedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
