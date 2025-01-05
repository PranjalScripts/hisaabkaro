// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "";
  return num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true
  });
};
