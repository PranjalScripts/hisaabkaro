export const calculatePercentage = (number, percentage) => {
  const percentageValue = (percentage / 100) * number;
  const finalValue = number + percentageValue;

  return {
    percentageValue,
    finalValue,
  };
};

export const calculateSimpleInterest = (principal, rate, time) => {
  const interest = (principal * rate * time) / 100;
  const totalAmount = Number(principal) + interest;

  return {
    interest,
    totalAmount,
  };
};

export const calculateCompoundInterest = (principal, rate, time, frequency = 1) => {
  const n = frequency; // number of times interest is compounded per year
  const r = rate / 100; // convert percentage to decimal
  
  const amount = principal * Math.pow(1 + r/n, n * time);
  const interest = amount - principal;

  return {
    interest: Number(interest.toFixed(2)),
    totalAmount: Number(amount.toFixed(2)),
  };
};
