import searchbar from '#@/lib/styles/buttons.module.css';
import styles from 'styles/card.module.css';
import typography from 'styles/fonts/typography.module.css';
import layout from 'styles/layout.module.css';

export function LinkCardSkeleton() {
  return (
    <div className={searchbar.notActive}>
      <h1 className={typography.titleMedium}>Cargando</h1>
      <div className={layout.segmentRow}>
        <sub className={searchbar.date}>00-00-0000</sub>
      </div>
      <div className={styles.links}>
        <p>cargando</p>
      </div>
    </div>
  );
}
