import axios from 'axios';

const API_URL = process.env.REACT_APP_URL;

export const fetchTransactionDetails = async (transactionId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/api/v4/transaction/get-transaction/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchBookName = async (bookId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/api/v2/transactionBooks/get-book/${bookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.book.bookname || "Unknown Book";
  } catch (error) {
    return "Unknown Book";
  }
};

export const fetchClientName = async (clientUserId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/api/v3/client/get-client/${clientUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      return {
        name: response.data.data.name,
        mobile: response.data.data.mobile,
        email: response.data.data.email
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching client details:", error);
    return null;
  }
};

export const createTransaction = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/api/v4/transaction/create-transaction`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateTransaction = async (transactionId, entryId, formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_URL}/api/v4/transaction/transactions/${transactionId}/history/${entryId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteTransactionEntry = async (transactionId, entryId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `${API_URL}/api/v4/transaction/transactions/${transactionId}/entries/${entryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
