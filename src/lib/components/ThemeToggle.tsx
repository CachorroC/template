// src/components/ThemeToggle.tsx
'use client';

import { useColorScheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // We only want to render the toggle on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Cycles through Light -> Dark -> System
  const handleToggle = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleToggle}
    >
      Current Mode: {mode}
    </Button>
  );
}
