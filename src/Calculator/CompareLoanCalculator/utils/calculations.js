// Loan calculation utilities
import { formatCurrency } from './formatters';

export const roundToTwoDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

export const calculateEMI = (principal, rate, time) => {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / (12 * 100);
  const t = parseFloat(time) * 12;
  const emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
  return isNaN(emi) ? 0 : roundToTwoDecimals(emi);
};

export const calculateTotalPayment = (emi, tenure) => {
  return roundToTwoDecimals(emi * tenure * 12);
};

export const calculateLoanDetails = (loan) => {
  const emi = calculateEMI(loan.amount, loan.interest, loan.tenure);
  const totalPayment = calculateTotalPayment(emi, loan.tenure);
  const totalInterest = roundToTwoDecimals(totalPayment - parseFloat(loan.amount));

  return {
    emi: roundToTwoDecimals(emi),
    totalPayment: roundToTwoDecimals(totalPayment),
    totalInterest: roundToTwoDecimals(totalInterest)
  };
};

export const analyzeLoans = (loanA, loanB) => {
  // Check if loans are identical
  if (loanA.amount === loanB.amount && 
      loanA.interest === loanB.interest && 
      loanA.tenure === loanB.tenure) {
    return {
      identical: true,
      message: "Both loans have identical terms. You can choose either option as they will have the same EMI and total cost."
    };
  }

  const betterLoan = loanA.totalPayment < loanB.totalPayment ? 'A' : 'B';
  const savings = roundToTwoDecimals(Math.abs(loanA.totalPayment - loanB.totalPayment));

  // Generate detailed reasons
  const reasons = [];
  const betterOption = betterLoan === 'A' ? loanA : loanB;
  const worseOption = betterLoan === 'A' ? loanB : loanA;

  // EMI comparison
  if (betterOption.emi < worseOption.emi) {
    reasons.push(`Lower monthly EMI (${betterOption.emi.toFixed(2)} vs ${worseOption.emi.toFixed(2)})`);
  }

  // Interest comparison
  if (betterOption.totalInterest < worseOption.totalInterest) {
    reasons.push(`Lower total interest (${betterOption.totalInterest.toFixed(2)} vs ${worseOption.totalInterest.toFixed(2)})`);
  }

  // Generate summary message
  let summaryMessage = '';
  if (betterOption.emi < worseOption.emi && betterOption.totalInterest < worseOption.totalInterest) {
    summaryMessage = `This option offers both lower monthly EMI and lower total interest, making it clearly superior.`;
  } else if (betterOption.emi < worseOption.emi) {
    summaryMessage = `While the total interest is slightly higher, the lower monthly EMI makes this more affordable.`;
  } else if (betterOption.totalInterest < worseOption.totalInterest) {
    summaryMessage = `Although the monthly EMI is higher, you'll save significantly on interest in the long run.`;
  }

  // Monthly savings calculation
  const monthlySavings = roundToTwoDecimals(Math.abs(loanA.emi - loanB.emi));
  const yearlySavings = roundToTwoDecimals(monthlySavings * 12);

  return {
    betterLoan,
    savings,
    reasons,
    summaryMessage,
    monthlySavings,
    yearlySavings
  };
};
