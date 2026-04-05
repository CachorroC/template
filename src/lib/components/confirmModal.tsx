'use client';

import React, { useEffect } from 'react';
import styles from '../styles/modal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isProcessing?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing = false,
}: ConfirmModalProps) {
  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={!isProcessing ? onClose : undefined}
    >
      <div
        className={styles.modal}
        onClick={(e) => {
          return e.stopPropagation();
        }} // Prevent clicks inside the modal from closing it
      >
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
