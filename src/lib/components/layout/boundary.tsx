import { ReactNode } from 'react';

export const LabelBoundary = ({
  children,
  color,
}: {
  children: ReactNode;
  color: 'primary' | 'secondary' | 'tertiary' | 'error';
}) => {
  return (
    <div
      style={{
        backgroundColor: `var(--${color}-container)`,
        padding: '1rem',
        color: `var(--on-${color}-container)`,
        gridColumn: 'span 8',
        gridRow: 'span 6',
      }}
    >
      {children}
    </div>
  );
};
