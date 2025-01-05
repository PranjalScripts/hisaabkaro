export const calculateEmiDetails = (principal, interestRate, tenure, tenureType, processingFee) => {
  const P = parseFloat(principal);
  const R = parseFloat(interestRate) / 12 / 100;
  let N = parseInt(tenure);
  const F = parseFloat(processingFee) || 0;

  if (tenureType === "years") {
    N = N * 12;
  }

  if (!P || !R || !N) {
    throw new Error("Please fill in all fields correctly.");
  }

  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const totalInterest = emi * N - P;
  const totalAmount = P + totalInterest + F;

  const emiDetails = [];
  let remainingPrincipal = P;

  for (let i = 1; i <= N; i++) {
    const interestForMonth = remainingPrincipal * R;
    const principalForMonth = emi - interestForMonth;
    remainingPrincipal -= principalForMonth;

    emiDetails.push({
      month: i,
      emi: Math.round(emi),
      interestPaid: Math.round(interestForMonth),
      principalPaid: Math.round(principalForMonth),
      remainingPrincipal: Math.round(remainingPrincipal),
    });
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    emiDetails
  };
};
