'use client';

import { Box, Skeleton } from '@mui/material';
import styles from '#@/lib/styles/layout.module.css';
import { Loader } from './loader';

// 1. Individual Skeleton Card mimicking a specimen item
const SkeletonCard = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* Image placeholder */}
      <Skeleton
        variant="rectangular"
        height={250}
        animation="wave"
        sx={{
          borderRadius: 2,
        }}
      />
      {/* Scientific name / Title placeholder */}
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          fontSize: '1.5rem',
          width: '80%',
        }}
      />
      {/* Subtitle / Description placeholder */}
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          width: '60%',
        }}
      />
    </Box>
  );
};

// 2. Responsive Grid mimicking your GridHolder
export const GridSkeletonLoader = () => {
  // Generate an array of 8 placeholder items to fill the screen
  const skeletons = Array.from(
    {
      length: 8,
    },
    (_, i) => {
      return i;
    },
  );

  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: 1,
        height: '100vh',
        overflowY: 'hidden', // Prevents scrolling on the skeleton itself
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr', // 1 column
            sm: 'repeat(2, 1fr)', // 2 columns
            md: 'repeat(3, 1fr)', // 3 columns
            lg: 'repeat(4, 1fr)', // 4 columns
          },
          alignItems: 'start',
        }}
      >
        {skeletons.map((index) => {
          return <SkeletonCard key={index} />;
        })}
      </Box>
    </Box>
  );
};

// 3. Updated MainLoader injecting the new Grid Skeleton
export const MainLoader = () => {
  return (
    <div className={styles.main}>
      <div className={styles.mainContent}>
        <GridSkeletonLoader />
      </div>
      <div className={styles.complementaryContent}>
        <Loader />
      </div>
    </div>
  );
};

// Original Loaders
