import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const inputStyles = `
  /* Remove spinner buttons for Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Remove spinner buttons for Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

function PercentageCalculator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("findPercentage");
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [result, setResult] = useState(null);

  const preventInvalidInput = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleNumberInput = (value, setter) => {
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

    if (!isNaN(formattedValue) && Number(formattedValue) >= 0) {
      setter(formattedValue);
    }
  };

  const calculateResult = () => {
    if (!number1 || !number2) {
      alert("Please fill in all required fields");
      return;
    }

    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    let calculatedResult;
    switch (activeTab) {
      case "findPercentage":
        calculatedResult = (num1 / num2) * 100;
        setResult({
          value: calculatedResult.toFixed(2),
          text: `${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`,
        });
        break;
      case "calculateValue":
        calculatedResult = (num1 * num2) / 100;
        setResult({
          value: calculatedResult.toFixed(2),
          text: `${num1}% of ${num2} is ${calculatedResult.toFixed(2)}`,
        });
        break;
      case "percentageChange":
        calculatedResult = ((num2 - num1) / num1) * 100;
        const changeType = calculatedResult >= 0 ? "increase" : "decrease";
        setResult({
          value: Math.abs(calculatedResult).toFixed(2),
          text: `The percentage ${changeType} from ${num1} to ${num2} is ${Math.abs(
            calculatedResult
          ).toFixed(2)}%`,
        });
        break;
    }
  };

  const resetForm = () => {
    setNumber1("");
    setNumber2("");
    setResult(null);
  };

  const renderInputLabels = () => {
    switch (activeTab) {
      case "findPercentage":
        return {
          label1: "Number to find percentage of",
          label2: "Total number",
        };
      case "calculateValue":
        return { label1: "Percentage", label2: "Number to calculate from" };
      case "percentageChange":
        return { label1: "Original Value", label2: "New Value" };
      default:
        return { label1: "", label2: "" };
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-8">
      <style>{inputStyles}</style>
      <button
        onClick={() => navigate("/calculator")}
        className="fixed left-8 top-8 z-50 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-all duration-200 font-medium border border-blue-100"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Calculators
      </button>

      <div className="max-w-3xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 card-hover">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-[-50%] translate-y-[-50%] w-[200%] h-[200%]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl text-white font-bold text-center mb-2">
                Percentage Calculator
              </h2>
              <p className="text-blue-100 text-center text-base">
                Calculate Percentage with Ease
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
              {["findPercentage", "calculateValue", "percentageChange"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      resetForm();
                    }}
                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "findPercentage"
                      ? "What % is A of B?"
                      : tab === "calculateValue"
                      ? "% of Number"
                      : "% Change"}
                  </button>
                )
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4">
                <label className="text-gray-700 font-medium">
                  {renderInputLabels().label1}
                </label>
                <input
                  type="number"
                  value={number1}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setNumber1)
                  }
                  onKeyDown={preventInvalidInput}
                  placeholder="Enter number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                />
              </div>

              <div className="grid gap-4">
                <label className="text-gray-700 font-medium">
                  {renderInputLabels().label2}
                </label>
                <input
                  type="number"
                  value={number2}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setNumber2)
                  }
                  onKeyDown={preventInvalidInput}
                  placeholder="Enter number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={calculateResult}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Calculate
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Result
                </h3>
                <p className="text-lg text-blue-600 font-medium">
                  {result.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InterestCalculator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("interestCalc_activeTab") || "simple"
  );
  const [principal, setPrincipal] = useState(
    localStorage.getItem("interestCalc_principal") || ""
  );
  const [rate, setRate] = useState(
    localStorage.getItem("interestCalc_rate") || ""
  );
  const [time, setTime] = useState(
    localStorage.getItem("interestCalc_time") || ""
  );
  const [frequency, setFrequency] = useState(
    localStorage.getItem("interestCalc_frequency") || "12"
  );
  const [result, setResult] = useState(null);

  useEffect(() => {
    localStorage.setItem("interestCalc_principal", principal);
    localStorage.setItem("interestCalc_rate", rate);
    localStorage.setItem("interestCalc_time", time);
    localStorage.setItem("interestCalc_frequency", frequency);
    localStorage.setItem("interestCalc_activeTab", activeTab);
  }, [principal, rate, time, frequency, activeTab]);

  const preventInvalidInput = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleNumberInput = (value, setter) => {
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

    if (!isNaN(formattedValue) && Number(formattedValue) >= 0) {
      setter(formattedValue);
    }
  };

  const handleCalculate = () => {
    if (!principal || !rate || !time) {
      alert("Please fill in all required fields");
      return;
    }

    const principalAmount = parseFloat(principal);
    const interestRate = parseFloat(rate) / 100;
    const timePeriod = parseFloat(time);

    let calculatedResult;
    switch (activeTab) {
      case "simple":
        calculatedResult = principalAmount * interestRate * timePeriod;
        setResult({
          interest: calculatedResult,
          total: principalAmount + calculatedResult,
        });
        break;
      case "compound":
        const n = parseInt(frequency);
        const compoundInterest =
          principalAmount * Math.pow(1 + interestRate / n, n * timePeriod) -
          principalAmount;
        setResult({
          interest: compoundInterest,
          total: principalAmount + compoundInterest,
        });
        break;
    }
  };

  const handleReset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setFrequency("12");
    setResult(null);
    localStorage.removeItem("interestCalc_principal");
    localStorage.removeItem("interestCalc_rate");
    localStorage.removeItem("interestCalc_time");
    localStorage.removeItem("interestCalc_frequency");
    localStorage.removeItem("interestCalc_activeTab");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-8">
      <style>{inputStyles}</style>
      <button
        onClick={() => navigate("/calculator")}
        className="fixed left-8 top-8 z-50 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-all duration-200 font-medium border border-blue-100"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Calculators
      </button>

      <div className="max-w-3xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 card-hover">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute inset-0 bg-white opacity-10 transform rotate-45 translate-x-[-50%] translate-y-[-50%] w-[200%] h-[200%]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl text-white font-bold text-center mb-2">
                Interest Calculator
              </h2>
              <p className="text-blue-100 text-center text-base">
                Calculate Simple & Compound Interest with Ease
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
              {["simple", "compound"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setResult(null);
                  }}
                  className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  {tab === "simple" ? "Simple Interest" : "Compound Interest"}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4">
                <label className="text-gray-700 font-medium">
                  Principal Amount
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setPrincipal)
                  }
                  onKeyDown={preventInvalidInput}
                  placeholder="Enter principal amount"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                />
              </div>

              <div className="grid gap-4">
                <label className="text-gray-700 font-medium">
                  Interest Rate (% per year)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => handleNumberInput(e.target.value, setRate)}
                    onKeyDown={preventInvalidInput}
                    placeholder="Enter interest rate"
                    className="w-full pl-4 pr-8 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-4">
                  <label className="text-gray-700 font-medium">
                    Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => handleNumberInput(e.target.value, setTime)}
                    onKeyDown={preventInvalidInput}
                    placeholder="Enter time period"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  />
                </div>

                {activeTab === "compound" ? (
                  <div className="grid gap-4">
                    <label className="text-gray-700 font-medium">
                      Compounding Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                    >
                      <option value="1">Annually (1/yr)</option>
                      <option value="2">Semi-Annually (2/yr)</option>
                      <option value="4">Quarterly (4/yr)</option>
                      <option value="12">Monthly (12/yr)</option>
                      <option value="365">Daily (365/yr)</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <label className="text-gray-700 font-medium text-transparent">
                      Spacer
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg border border-transparent"></div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Calculate
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Calculation Results
                </h3>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600">Principal Amount</span>
                    <span className="font-medium text-gray-900">
                      {Number(principal).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600">Interest Earned</span>
                    <span className="font-medium text-green-600">
                      {Number(result.interest).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-blue-600">
                      {Number(result.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    {activeTab === "compound"
                      ? `Compounding ${
                          frequency === "1"
                            ? "annually"
                            : frequency === "2"
                            ? "semi-annually"
                            : frequency === "4"
                            ? "quarterly"
                            : frequency === "12"
                            ? "monthly"
                            : "daily"
                        }`
                      : "Simple interest calculation"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterestCalculator;
