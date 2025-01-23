// Google Analytics utility functions
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Initialize GA
export const initGA = () => {
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      app_name: 'Hisaab करो',
      app_version: '1.0.0'
    });
  }
};

// Track page views
export const pageView = (path) => {
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user sign in
export const trackSignIn = (method) => {
  event({
    action: 'login',
    category: 'User',
    label: method,
  });
};

// Track transactions
export const trackTransaction = (transactionData) => {
  event({
    action: 'create_transaction',
    category: 'Transaction',
    label: transactionData.transactionType,
    value: parseFloat(transactionData.amount) || 0,
  });
};

// Track user registration
export const trackRegistration = (method) => {
  event({
    action: 'sign_up',
    category: 'User',
    label: method,
  });
};

// Track errors
export const trackError = (error) => {
  event({
    action: 'error',
    category: 'Error',
    label: error.message || 'Unknown error',
  });
};

// Track book creation
export const trackBookCreation = (bookData) => {
  event({
    action: 'create_book',
    category: 'Book',
    label: bookData.bookname,
  });
};

// Track client addition
export const trackClientAddition = (clientData) => {
  event({
    action: 'add_client',
    category: 'Client',
    label: clientData.name,
  });
};

// Track search
export const trackSearch = (searchTerm, resultCount) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultCount,
  });
};
