import styles from '#@/lib/styles/layout.module.css';
import modalStyles from '#@/lib/styles/modal.module.css';

export const ModalLoader = () => {
  return (
    <div className={modalStyles.open}>
      <div className={styles.loader}></div>
    </div>
  );
};
