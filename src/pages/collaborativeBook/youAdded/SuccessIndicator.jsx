import React, { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';

const SuccessIndicator = ({ show }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000); // Hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 text-green-600 p-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
      <MdCheckCircle className="text-2xl animate-bounce" />
      <span className="font-semibold">Transaction updated successfully!</span>
    </div>
  );
};

export default SuccessIndicator;
