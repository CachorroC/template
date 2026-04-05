'use client';

import styles from 'styles/card.module.css';

export default function GlobalError(
  {
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }
) {
  return (
    <html>
      <body>
        <div className={styles.errorContainer}>
          <h2>{error.name}</h2>
          <p>{error.message}</p>
          <button
            onClick={() => {
              return reset();
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
