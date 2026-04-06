'use client';

import styles from 'styles/card.module.css';
import { useEffect } from 'react';
import typography from 'styles/fonts/typography.module.css';

export default function Error(
  {
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  } 
) {
  useEffect(
    () => {
      console.error(
        error 
      );
    }, [
      error
    ] 
  );

  return (
    <div className={styles.errorContainer}>
      <h2 className={typography.displayLarge}>{error.name}</h2>
      <p className={typography.bodyMedium}>{error.message}</p>
      <span>{error.digest}</span>
      <button
        className={styles.errorContainer}
        onClick={() => {
          return reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}
