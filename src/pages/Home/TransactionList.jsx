 
import React from "react";

const TransactionList = () => {
  const transactions = [
    { name: "Deposit from my Card", amount: "-$850", color: "text-red-500" },
    { name: "Deposit Paypal", amount: "+$2,500", color: "text-green-500" },
    { name: "Jemi Wilson", amount: "+$5,400", color: "text-green-500" },
    { name: "Online Shopping", amount: "-$1,200", color: "text-red-500" },
    { name: "Freelance Payment", amount: "+$3,000", color: "text-green-500" },
  ];

  return (
    <div
      className="bg-white p-4 rounded-xl shadow-lg"
      style={{ maxHeight: "300px", overflowY: "auto" }} // Restrict height and allow scrolling
    >
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <ul>
        {transactions.map((tx, idx) => (
          <li key={idx} className="flex justify-between mb-2">
            <span>{tx.name}</span>
            <span className={`font-semibold ${tx.color}`}>{tx.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
