import React from 'react';
import { useEmiCalculator } from '../hooks/useEmiCalculator';

const LoanInputForm = ({ onCalculate }) => {
  const {
    principal,
    interestRate,
    tenure,
    tenureType,
    processingFee,
    isCalculating,
    handleNumberInput,
    preventInvalidInput,
    setPrincipal,
    setInterestRate,
    setTenure,
    setTenureType,
    setProcessingFee,
  } = useEmiCalculator();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Loan Details
        </h3>
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Principal Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                className="block w-full py-3.5 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input-focus-effect"
                value={principal}
                onChange={(e) => handleNumberInput(e.target.value, setPrincipal)}
                onKeyDown={preventInvalidInput}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                className="block w-full pr-12 py-3.5 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input-focus-effect"
                value={interestRate}
                onChange={(e) => handleNumberInput(e.target.value, setInterestRate)}
                onKeyDown={preventInvalidInput}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                Loan Term
              </label>
              <input
                type="number"
                min="0"
                step="any"
                className="block w-full py-3.5 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input-focus-effect"
                value={tenure}
                onChange={(e) => handleNumberInput(e.target.value, setTenure)}
                onKeyDown={preventInvalidInput}
                placeholder="Duration"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                Term Type
              </label>
              <select
                className="block w-full py-3.5 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input-focus-effect"
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value)}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Processing Fee
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                className="block w-full py-3.5 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input-focus-effect"
                value={processingFee}
                onChange={(e) => handleNumberInput(e.target.value, setProcessingFee)}
                onKeyDown={preventInvalidInput}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onCalculate({
          principal,
          interestRate,
          tenure,
          tenureType,
          processingFee
        })}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isCalculating}
      >
        {isCalculating ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Calculating...
          </span>
        ) : (
          <span className="inline-flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Calculate EMI
          </span>
        )}
      </button>
    </div>
  );
};

export default LoanInputForm;
