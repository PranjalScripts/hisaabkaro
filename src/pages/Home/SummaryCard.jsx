 
const SummaryCard = ({ title, value, color }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${color}`}>
      <h4 className="text-gray-700 font-semibold">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default SummaryCard;
