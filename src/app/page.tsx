
import NotificationButton from '#@/lib/components/NotificationButton';
import NotificationToggle from '#@/lib/components/NotificationToggle';
import { InstallPrompt,
  PushNotificationManager, } from '#@/lib/components/pushNotificationManager';
import styles from '#@/lib/styles/landing.module.css';
import layout from '#@/lib/styles/layout.module.css';
import Image from 'next/image';
import Hero from '#@/lib/components/Hero/Hero';
// You can easily import future components here like:
// import Features from '@/components/Features/Features';

export default function Home() {
  return (
    <main className={layout.main}>
      <Hero />
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
  );
}
