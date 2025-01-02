import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import ImageModal from "./ImageModal";
import TransactionForm from "./TransactionForm";
import EditTransactionForm from "./EditTransactionForm";
import { useTransaction } from "./useTransaction";
import { useTransactionForm } from "./useTransactionForm";
import { useEditTransaction } from "./useEditTransaction";
import DeleteConfirmationModal from "../youAdded/DeleteConfirmationModal";
import SuccessModal from "../youAdded/SuccessModal";
import ErrorModal from "../youAdded/ErrorModal";

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams();
  const {
    transaction,
    setTransaction,
    updatingEntryId,
    modalState,
    userId,
    setModalState,
    updateTransactionStatus,
    handleDelete,
    handleImageClick,
    handleDownload,
    errorMessage,
    setErrorMessage,
    confirmDelete,
    cancelDelete,
    deleteTransactionDetails,
    closeModal
  } = useTransaction(transactionId);

  const {
    showForm,
    formData,
    isSubmitting,
    error,
    success,
    setShowForm,
    setFormData,
    setError,
    setSuccess,
    handleInputChange,
    handleAddTransaction,
  } = useTransactionForm(transactionId, setTransaction);

  useEffect(() => {
    if (error) {
      setModalState(prev => ({ 
        ...prev, 
        showErrorModal: true,
        errorMessage: error 
      }));
      setError("");
    }
  }, [error, setError, setModalState]);

  useEffect(() => {
    if (success) {
      setModalState(prev => ({ ...prev, showSuccessModal: true }));
      setSuccess(false);
    }
  }, [success, setSuccess, setModalState]);

  const {
    isEditing,
    editData,
    setEditData,
    openEditForm,
    closeEditForm,
    handleEditSubmit,
  } = useEditTransaction(transactionId, setTransaction, {
    onSuccess: () => {
      setModalState(prev => ({ ...prev, showSuccessModal: true }));
      closeEditForm();
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to update transaction. Please try again.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
    }
  });

  if (!transaction) {
    return <div className="text-center py-10">Loading transaction details...</div>;
  }

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
          Transaction Details
        </h1>

        {/* Transaction Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* User Name Card */}
          <div className="group relative bg-gradient-to-br from-cyan-50 via-sky-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-sky-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-cyan-600/90 mb-1">User Name</p>
              <p className="text-xl font-bold text-cyan-700 truncate">
                {transaction.userId.name}
              </p>
            </div>
          </div>

          {/* Other User Card */}
          <div className="group relative bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-rose-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-pink-600/90 mb-1">Other User</p>
              <p className="text-xl font-bold text-pink-700 truncate">
                {transaction.clientUserId.name}
              </p>
            </div>
          </div>

          {/* Book Name Card */}
          <div className="group relative bg-gradient-to-br from-indigo-50 via-violet-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-indigo-600/90 mb-1">Book Name</p>
              <p className="text-xl font-bold text-indigo-700 truncate">
                {transaction.bookId.bookname}
              </p>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div className={`group relative bg-gradient-to-br ${
            userId === transaction.initiaterId
              ? transaction.outstandingBalance > 0
                ? "from-teal-50 via-emerald-50"
                : "from-orange-50 via-amber-50"
              : transaction.outstandingBalance > 0
              ? "from-orange-50 via-amber-50"
              : "from-teal-50 via-emerald-50"
          } to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${
              userId === transaction.initiaterId
                ? transaction.outstandingBalance > 0
                  ? "from-teal-100/50 via-emerald-50/30"
                  : "from-orange-100/50 via-amber-50/30"
                : transaction.outstandingBalance > 0
                ? "from-orange-100/50 via-amber-50/30"
                : "from-teal-100/50 via-emerald-50/30"
            } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative p-6">
              <p className={`text-sm font-medium ${
                userId === transaction.initiaterId
                  ? transaction.outstandingBalance > 0
                    ? "text-teal-600/90"
                    : "text-orange-600/90"
                  : transaction.outstandingBalance > 0
                  ? "text-orange-600/90"
                  : "text-teal-600/90"
              } mb-1`}>Outstanding Balance</p>
              <p className={`text-xl font-bold ${
                userId === transaction.initiaterId
                  ? transaction.outstandingBalance > 0
                    ? "text-teal-700"
                    : "text-orange-700"
                  : transaction.outstandingBalance > 0
                  ? "text-orange-700"
                  : "text-teal-700"
              }`}>
                {Math.abs(transaction.outstandingBalance).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center sm:justify-start gap-4 mb-8">
          <button
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none"
            onClick={() => {
              setShowForm(true);
              setFormData((prev) => ({
                ...prev,
                transactionType: "you will get",
              }));
            }}
          >
            You Will Give
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none"
            onClick={() => {
              setShowForm(true);
              setFormData((prev) => ({
                ...prev,
                transactionType: "you will give",
              }));
            }}
          >
            You Will Get
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <TransactionForm
                  formData={formData}
                  isSubmitting={isSubmitting}
                  onSubmit={handleAddTransaction}
                  onChange={handleInputChange}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <h2 className="text-2xl font-bold text-gray-900 p-6 border-b">
            Transaction History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiated By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transaction?.transactionHistory?.length > 0 ? (
                  transaction.transactionHistory.map((history) => {
                    console.log("Transaction history entry:", history);
                    return (
                      <tr key={history._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history?.transactionDate ? new Date(history.transactionDate).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history.initiatedBy === transaction.userId._id
                            ? transaction.userId.name
                            : transaction.clientUserId.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history?.transactionType === "you will give" ? "You will get" : "You will give"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {history?.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {history?.description || ''}
                        </td>
                        <td className="px-6 py-4">
                          {typeof history.file === "string" && history.file.trim() !== "" ? (
                            history.file.toLowerCase().endsWith('.pdf') ? (
                              <div 
                                className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-2"
                                onClick={() => window.open(`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`, '_blank')}
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>View PDF</span>
                              </div>
                            ) : (
                              <img
                                src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                                alt="Transaction File"
                                className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => handleImageClick(`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`, history.file)}
                              />
                            )
                          ) : (
                            <span className="text-sm text-gray-500">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {history?.confirmationStatus === "confirmed" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Confirmed
                            </span>
                          ) : userId === history?.initiaterId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => updateTransactionStatus(history._id)}
                              disabled={updatingEntryId === history._id}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                updatingEntryId === history._id ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {updatingEntryId === history._id ? "Updating..." : "Confirm"}
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userId === history?.initiaterId ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => openEditForm(history)}
                                className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                title="Edit"
                              >
                                <MdEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete clicked for history:", history);
                                  handleDelete(history);
                                }}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Delete"
                              >
                                <MdDelete className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              Not initiated by you
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                      No transaction history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <EditTransactionForm
          editData={editData}
          onSubmit={handleEditSubmit}
          onChange={setEditData}
          onCancel={closeEditForm}
          isOpen={isEditing}
        />

        <DeleteConfirmationModal
          isOpen={modalState.showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          transactionDetails={deleteTransactionDetails}
        />

        <SuccessModal
          isOpen={modalState.showSuccessModal}
          message={updatingEntryId ? "Transaction status updated successfully!" : "Action Done Successfully"}
          onClose={() => setModalState(prev => ({ ...prev, showSuccessModal: false }))}
        />

        <ErrorModal
          isOpen={modalState.showErrorModal}
          message={errorMessage}
          onClose={() => setModalState(prev => ({ ...prev, showErrorModal: false }))}
        />

        <ImageModal
          isOpen={modalState.isModalOpen}
          imageUrl={modalState.modalImage}
          onClose={() => setModalState(prev => ({ ...prev, isModalOpen: false, modalImage: null }))}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default CollaborativeBookRecords;