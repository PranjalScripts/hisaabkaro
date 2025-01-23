import { createContext } from 'react';

export const ModalContext = createContext({
  successModal: {
    isOpen: false,
    message: '',
  },
  setSuccessModal: () => {},
});
