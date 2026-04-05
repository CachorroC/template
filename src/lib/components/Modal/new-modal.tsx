'use client';
import { useModalContext } from '#@/app/context/ModalContext';
import styles from '#@/lib/styles/modal.module.css';
import { ReactNode } from 'react';

export default function NewModal({ children }: { children: ReactNode }) {
  const { isModalOpen, setIsModalOpen } = useModalContext();

  return (
    <>
      {isModalOpen && (
        <div
          className={styles.open}
          onClick={() => {
            if (isModalOpen) {
              return setIsModalOpen(false);
            }

            return setIsModalOpen(true);
          }}
        >
          <div
            className={styles.wrapper}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
