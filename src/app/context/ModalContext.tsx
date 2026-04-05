'use client';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
} from 'react';

const ModalContext = createContext<{
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error('useModalContext must be used inside a ModalProvider');
  }

  return context;
}
