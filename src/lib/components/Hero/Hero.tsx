import styles from '#@/lib/styles/hero.module.css';


export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Cultivate Your <span className={styles.highlight}>Ideas</span>
          </h1>
          <p className={styles.subtitle}>
            A beautifully structured, reusable architecture designed to scale naturally.
            Deploy your next big project with a solid, modular foundation.
          </p>
          <div className={styles.ctaGroup}>
            <button className={styles.primaryBtn}>Get Started</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
        <div className={styles.visual}>
          {/* Placeholder for an illustration, 3D element, or image */}
          <div className={styles.imagePlaceholder}></div>
        </div>
      </div>
    </section>
  );
}