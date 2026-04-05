'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme(
  {
    cssVariables: {
    // Changed from 'data' to 'data-theme' to ensure an exact match with the script
      colorSchemeSelector: 'data',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#4A6741',
          // Deep, calming forest green
          },
          secondary: {
            main: '#8C5A40',
          },
          error: {
            main: '#ba1a1a',
          },
          warning: {
            main: '#fb8c00',
          },
          info: {
            main: '#3949ab',
          },
          success: {
            main: '#628e2e',
          },
        },
      },
      dark: {
        palette: {
        // Slightly lighter shades usually work better for dark mode contrast
          primary: {
            main: '#9ce39e',
          },
          secondary: {
            main: '#b1cead',
          },
          error: {
            main: '#ffb4ab',
          },
          warning: {
            main: '#ffa726',
          },
          info: {
            main: '#5c6bc0',
          },
          success: {
            main: '#dcedc8',
          },
        },
      },
    },
    typography: {
      fontFamily: 'var(--josefa)',
      subtitle1 : {
        fontFamily: 'var(--lora-font)'
      },
    }
  }
);

export default theme;
