'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box, } from '@mui/material';
import NotificationButton from '#@/lib/components/NotificationButton';
import NotificationToggle from '#@/lib/components/NotificationToggle';
import { InstallPrompt,
  PushNotificationManager, } from '#@/lib/components/pushNotificationManager';
import styles from '#@/lib/styles/landing.module.css';
import layout from '#@/lib/styles/layout.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const [
    searchTerm,
    setSearchTerm
  ] = useState(
    '' 
  );

  // State to track if the user is searching for a plant name or an illness
  const [
    searchType,
    setSearchType
  ] = useState<'name' | 'dolor'>(
    'name' 
  );

  // Function to handle navigation
  const handleSearch = () => {
    if ( searchTerm.trim() ) {
      // Encode the URI component and dynamically set the parameter key (name or dolor)
      router.push(
        `/hierbas?${ searchType }=${ encodeURIComponent(
          searchTerm.trim() 
        ) }`,
      );
    } else {
      router.push(
        '/hierbas' 
      );
    }
  };

  return (
    <div className={layout.main}>
      <main className={styles.mainContainer}>
        {/* Navigation/Header area */}
        <header className={styles.header}>
          <div className={styles.logo}>Raíces & Alivio</div>
          <nav className={styles.nav}>
            <Link
              href="#vademecum"
              className={styles.navLink}
            >
              El Vademécum
            </Link>
            <Link
              href="/hierbas"
              className={styles.navLink}
            >
              Lista de plantas medicinales
            </Link>
            <Link
              href="/hierba/nueva"
              className={styles.navLink}
            >
              Aporta tu conocimiento en el vademecum
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              Botánica Medicinal Colombiana
            </span>
            <h1 className={styles.title}>
              Encuentra calma y sanación en la sabiduría de la tierra.
            </h1>
            <p className={styles.subtitle}>
              Un refugio para el alivio del dolor y el bienestar del espíritu.
              Explora nuestro vademécum de plantas nativas, desde la serenidad
              de la Passiflora hasta la resiliencia de los páramos.
            </p>

            {/* MUI Search Form */}
            <div className={styles.searchContainer}>
              <Box
                sx={{
                  display      : 'flex',
                  flexDirection: 'column',
                  width        : '100%',
                  gap          : 2,
                }}
              >
                {/* Search Type Selector */}
                <RadioGroup
                  row
                  value={searchType}
                  onChange={(
                    e 
                  ) => {
                    return setSearchType(
                      e.target.value as 'name' | 'dolor' 
                    );
                  }}
                  sx={{
                    color         : 'text.primary',
                    justifyContent: 'flex-start',
                  }}
                >
                  <FormControlLabel
                    value="name"
                    control={<Radio color="primary" />}
                    label="Buscar por Planta"
                  />
                  <FormControlLabel
                    value="dolor"
                    control={<Radio color="primary" />}
                    label="Buscar por Dolencia"
                  />
                </RadioGroup>

                <Box
                  sx={{
                    display: 'flex',
                    gap    : 1,
                  }}
                >
                  <TextField
                    id="search-plant"
                    label={
                      searchType === 'name'
                        ? 'Ej. Caléndula, Árnica...'
                        : 'Ej. Dolor de cabeza, inflamación...'
                    }
                    variant="outlined"
                    fullWidth
                    color="primary"
                    value={searchTerm}
                    onChange={(
                      e 
                    ) => {
                      return setSearchTerm(
                        e.target.value 
                      );
                    }}
                    onKeyDown={(
                      e 
                    ) => {
                      if ( e.key === 'Enter' ) {
                        handleSearch();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={styles.searchButton}
                    onClick={handleSearch}
                    sx={{
                      padding: '15px 30px',
                    }}
                  >
                    Explorar
                  </Button>
                </Box>
              </Box>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <div className={styles.imagePlaceholder}>
              <Image
                src={'/images/nature_4.png'}
                alt={'Healing'}
                fill={true}
                style={{
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </section>

        {/* Philosophy / Empathy Section */}
        <section
          className={styles.philosophy}
          id="filosofia"
        >
          <h2 className={styles.sectionTitle}>
            Honrando tu proceso de sanación
          </h2>
          <p className={styles.sectionText}>
            Entendemos que el dolor físico y emocional caminan de la mano. La
            fitoterapia tradicional no solo busca suprimir el síntoma, sino
            abrazar el cuerpo, escuchar su lenguaje y utilizar las propiedades
            curativas de nuestra biodiversidad para restaurar el equilibrio
            holístico.
          </p>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Conocimiento Ancestral</h3>
              <p>
                Rescatamos los usos tradicionales de las comunidades que han
                custodiado estos saberes por generaciones.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Alivio Compasivo</h3>
              <p>
                Guías específicas para el manejo del dolor inflamatorio,
                muscular y espiritual de manera natural.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Conexión Botánica</h3>
              <p>
                Aprende a preparar infusiones, cataplasmas y tinturas respetando
                los ciclos de cada planta.
              </p>
            </div>
          </div>
        </section>

        <NotificationButton />
        <PushNotificationManager />
        <NotificationToggle />
        <InstallPrompt />
      </main>
    </div>
  );
}
