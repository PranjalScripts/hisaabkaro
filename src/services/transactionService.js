import axios from 'axios';

const API_URL = process.env.REACT_APP_URL;

export const fetchTransactions = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/api/v4/transaction/transactions`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTransaction = async (formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      `${API_URL}/api/v4/transaction/create-transaction`,
      formData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransactionEntry = async (transactionId, entryId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(
      `${API_URL}/api/v4/transaction/transactions/${transactionId}/entries/${entryId}`,
      {
        headers: { Authorization: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
