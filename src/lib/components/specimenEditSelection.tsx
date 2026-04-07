'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// import TemplateForm from './form/TemplateForm'; // Renamed import if exists
// import DataDisplay from './display/DataDisplay'; // Renamed import if exists
import { TemplateType, MediaItem } from '../types/template';
import Link from 'next/link';
import { useAccordionScroll } from '#@/app/context/AcordionScrollContext';
import buttonStyles from '../styles/buttons.module.css';

export default function SpecimenEditSelection(
  {
    data,
    isStandalone = false,
  }: {
    data         : TemplateType;
    isStandalone?: boolean;
  }
) {
  const [
    isEditing,
    setIsEditing
  ] = useState(
    false
  );
  const [
    currentImageIndex,
    setCurrentImageIndex
  ] = useState(
    0
  );
  const [
    isAutoPlay,
    setIsAutoPlay
  ] = useState(
    true
  );
  const {
    cardRefs
  } = useAccordionScroll();

  const defaultImage
    = 'https://via.placeholder.com/400x300?text=No+Image+Available';

  // Extract available images from the gallery into a flat array
  const carouselImages = useMemo(
    () => {
      const imgs: MediaItem[] = [];

      if ( data.gallery ) {
        if ( data.gallery.primary ) {
          imgs.push(
            data.gallery.primary
          );
        }

        if ( data.gallery.secondary ) {
          imgs.push(
            data.gallery.secondary
          );
        }

        if ( data.gallery.detail ) {
          imgs.push(
            data.gallery.detail
          );
        }

        if ( data.gallery.extra ) {
          imgs.push(
            data.gallery.extra
          );
        }
      }

      return imgs;
    }, [
      data.gallery
    ]
  );

  // Handle the automatic 5-second carousel timer
  useEffect(
    () => {
      if ( carouselImages.length <= 1 || !isAutoPlay ) {
        return () => {
        };
      } // No need to auto-play if 1 or 0 images

      const timer = setInterval(
        () => {
          setCurrentImageIndex(
            (
              prevIndex
            ) => {
              return ( prevIndex + 1 ) % carouselImages.length;
            }
          );
        }, 5000
      );

      return () => {
        return clearInterval(
          timer
        );
      };
    }, [
      carouselImages.length,
      isAutoPlay
    ]
  );

  // Manual navigation handlers
  const handleNextImage = () => {
    setIsAutoPlay(
      false
    );
    setCurrentImageIndex(
      (
        prev
      ) => {
        return ( prev + 1 ) % carouselImages.length;
      }
    );
  };

  const handlePrevImage = () => {
    setIsAutoPlay(
      false
    );
    setCurrentImageIndex(
      (
        prev
      ) => {
        return ( prev - 1 + carouselImages.length ) % carouselImages.length;
      }
    );
  };

  return (
    <Card
      sx={{
        width          : '100%',
        maxWidth       : '100%',
        mx             : 'auto',
        boxShadow      : 3,
        borderRadius   : 2,
        containerType  : 'inline-size',
        containerName  : 'specimenCard',
        display        : 'flex',
        flexDirection  : 'column',
        backgroundColor: 'var(--surface-container-lowest)',
        maxHeight      : isStandalone
          ? '85vh'
          : 'none',
      }}
      ref={(
        el: HTMLDivElement | null
      ) => {
        if ( el ) {
          cardRefs.current[ data.title ] = el;
        }
      }}
    >
      <Box
        sx={{
          display                                     : 'flex',
          flexDirection                               : 'column',
          flexGrow                                    : 1,
          overflow                                    : 'hidden',
          '@container specimenCard (min-width: 600px)': {
            flexDirection: 'row',
          },
        }}
      >
        {/* IMAGE SECTION */}
        <Box
          sx={{
            width                                       : '100%',
            overflow                                    : 'hidden',
            position                                    : 'relative',
            '@container specimenCard (min-width: 600px)': {
              width: '41.66%',
            },
          }}
        >
          {carouselImages.length > 0
            ? (
                <>
                  <CardMedia
                    component="img"
                    sx={{
                      height                                      : 400,
                      objectFit                                   : 'cover',
                      transition                                  : 'opacity 0.5s ease-in-out',
                      '@container specimenCard (min-width: 600px)': {
                        height: '100%',
                      },
                    }}
                    image={carouselImages[ currentImageIndex ].src}
                    alt={carouselImages[ currentImageIndex ].alt}
                  />

                  {carouselImages.length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{
                          position       : 'absolute',
                          left           : 8,
                          top            : '50%',
                          transform      : 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color          : 'white',
                          '&:hover'      : {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </IconButton>
                      <IconButton
                        onClick={handleNextImage}
                        sx={{
                          position       : 'absolute',
                          right          : 8,
                          top            : '50%',
                          transform      : 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color          : 'white',
                          '&:hover'      : {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </IconButton>
                    </>
                  )}
                </>
              )
            : (
          /* FALLBACK TO SINGLE IMAGE URL */
                <CardMedia
                  component="img"
                  sx={{
                    height                                      : 400,
                    objectFit                                   : 'cover',
                    '@container specimenCard (min-width: 600px)': {
                      height: '100%',
                    },
                  }}
                  image={data.image || defaultImage}
                  alt={data.title}
                />
              )}
        </Box>

        {/* CONTENT SECTION */}
        <Box
          sx={{
            width                                       : '100%',
            display                                     : 'flex',
            flexDirection                               : 'column',
            overflowY                                   : 'auto',
            p                                           : 2,
            '@container specimenCard (min-width: 600px)': {
              width: '58.33%',
            },
          }}
        >
          {isEditing
            ? (
                <div>Editing mode - Form placeholder</div>
              )
            : (
                <div>Viewing mode - Display placeholder</div>
              )}
          <div
            style={{
              display       : 'flex',
              flexFlow      : 'row nowrap',
              justifyContent: 'space-around',
              marginTop     : 'auto',
              paddingTop    : '1rem',
            }}
          >
            <button
              className={`${ buttonStyles.md3Btn } ${ buttonStyles.md3BtnTonalPrimary }`}
              onClick={() => {
                return setIsEditing(
                  (
                    edit
                  ) => {
                    return !edit;
                  }
                );
              }}
            >
              <span
                className={`material-symbols-outlined ${ buttonStyles.md3BtnIcon }`}
              >
                edit
              </span>
              <p>editar</p>
            </button>

            <Link
              href={`/hierba/${ data.title }`}
              className={`${ buttonStyles.md3Btn } ${ buttonStyles.md3BtnTonal }`}
            >
              <span
                className={`material-symbols-outlined ${ buttonStyles.md3BtnIcon }`}
              >
                expand_all
              </span>
              <p>ver más</p>
            </Link>
          </div>
        </Box>
      </Box>
    </Card>
  );
}
