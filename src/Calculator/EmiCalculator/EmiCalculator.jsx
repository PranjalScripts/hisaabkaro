import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoanInputForm from "./components/LoanInputForm";
import LoanSummary from "./components/LoanSummary";
import RepaymentSchedule from "./components/RepaymentSchedule";
import { calculateEmiDetails } from "./utils/calculations";
import { generatePDF } from "./utils/pdfGenerator";

function EmiCalculator() {
  const navigate = useNavigate();
  const [emi, setEmi] = useState(() => {
    const savedEmi = localStorage.getItem("emiCalculator_emi");
    return savedEmi ? parseFloat(savedEmi) : null;
  });
  const [totalInterest, setTotalInterest] = useState(() => {
    const savedTotalInterest = localStorage.getItem(
      "emiCalculator_totalInterest"
    );
    return savedTotalInterest ? parseFloat(savedTotalInterest) : null;
  });
  const [totalAmount, setTotalAmount] = useState(() => {
    const savedTotalAmount = localStorage.getItem("emiCalculator_totalAmount");
    return savedTotalAmount ? parseFloat(savedTotalAmount) : null;
  });
  const [emiDetails, setEmiDetails] = useState(() => {
    const savedEmiDetails = localStorage.getItem("emiCalculator_emiDetails");
    return savedEmiDetails ? JSON.parse(savedEmiDetails) : [];
  });
  const [activeTab, setActiveTab] = useState("calculator");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleCalculate = (values) => {
    try {
      const result = calculateEmiDetails(
        values.principal,
        values.interestRate,
        values.tenure,
        values.tenureType,
        values.processingFee
      );

      setEmi(result.emi);
      setTotalInterest(result.totalInterest);
      setTotalAmount(result.totalAmount);
      setEmiDetails(result.emiDetails);

      // Save to localStorage
      localStorage.setItem("emiCalculator_emi", result.emi);
      localStorage.setItem("emiCalculator_totalInterest", result.totalInterest);
      localStorage.setItem("emiCalculator_totalAmount", result.totalAmount);
      localStorage.setItem(
        "emiCalculator_emiDetails",
        JSON.stringify(result.emiDetails)
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    // Clear all state
    setEmi(null);
    setTotalInterest(null);
    setTotalAmount(null);
    setCurrentPage(1);
    setActiveTab("calculator");
    setEmiDetails([]);

    // Clear localStorage
    localStorage.removeItem("emiCalculator_emi");
    localStorage.removeItem("emiCalculator_totalInterest");
    localStorage.removeItem("emiCalculator_totalAmount");
    localStorage.removeItem("emiCalculator_emiDetails");
  };

  const downloadPDF = () => {
    const values = {
      principal: localStorage.getItem("emiCalculator_principal"),
      interestRate: localStorage.getItem("emiCalculator_interestRate"),
      tenure: localStorage.getItem("emiCalculator_tenure"),
      tenureType: localStorage.getItem("emiCalculator_tenureType"),
      processingFee: localStorage.getItem("emiCalculator_processingFee"),
      emi,
      totalInterest,
      totalAmount,
      emiDetails,
    };
    generatePDF(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate("/calculator")}
          className="text-blue-800 hover:text-blue-900 flex items-center space-x-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
          title="Back to Calculators"
        >
          <span className="text-xl mr-1">←</span>
          <span className="text-lg">Back to Calculators</span>
        </button>
      </div>

      {/* Main calculator card */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 card-hover">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-[-50%] translate-y-[-50%] w-[200%] h-[200%]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl text-white font-bold text-center mb-2">
                Smart EMI Calculator
              </h2>
              <p className="text-blue-100 text-center text-lg">
                Plan your loan with our advanced EMI calculator
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-blue-600 flex items-center space-x-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                title="Clear all fields"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12H9m0 0h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Reset Calculator</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {emi && (
                <button
                  onClick={downloadPDF}
                  className="text-gray-600 hover:text-blue-600 flex items-center space-x-2 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                  title="Download repayment schedule"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download Schedule</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                activeTab === "calculator"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("calculator")}
            >
              Calculator
            </button>
            <button
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                activeTab === "schedule"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              Repayment Schedule
            </button>
          </div>

          {activeTab === "calculator" ? (
            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Input Section */}
              <LoanInputForm onCalculate={handleCalculate} />

              {/* Results Section */}
              {emi && (
                <LoanSummary
                  emi={emi}
                  totalInterest={totalInterest}
                  totalAmount={totalAmount}
                  principal={localStorage.getItem("emiCalculator_principal")}
                  processingFee={localStorage.getItem(
                    "emiCalculator_processingFee"
                  )}
                />
              )}
            </div>
          ) : (
            <div className="p-8">
              <RepaymentSchedule
                emiDetails={emiDetails}
                currentPage={currentPage}
                entriesPerPage={entriesPerPage}
                setCurrentPage={setCurrentPage}
                setEntriesPerPage={setEntriesPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmiCalculator;
