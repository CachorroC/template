'use client';

import { useRouter } from 'next/navigation';
import { useNavigationContext } from '#@/app/context/navigation-context';
import buttonStyles from '#@/lib/styles/buttons.module.css';
import { segmentRow } from '#@/lib/styles/layout.module.css';

// TODO: arreglar lo de la navegacion

export const DrawerMenuButton = () => {
  const { isNavOpen, setIsNavOpen } = useNavigationContext();

  return (
    <button
      type="button"
      className={
        isNavOpen
          ? buttonStyles.buttonDrawerMenuOpen
          : buttonStyles.buttonDrawerMenuClosed
      }
      onClick={() => {
        setIsNavOpen((n) => {
          return !n;
        });
      }}
    >
      <span className={`material-symbols-outlined ${buttonStyles.icon}`}>
        {isNavOpen ? 'close' : 'menu'}
      </span>
    </button>
  );
};

export function ForwardBackwardNavButtons() {
  const router = useRouter();

  return (
    <section className={segmentRow}>
      <button
        type="button"
        className={buttonStyles.buttonBackwards}
        onClick={() => {
          router.back();
        }}
      >
        <span className={`material-symbols-outlined ${buttonStyles.icon}`}>
          chevron_left
        </span>
        <p className={buttonStyles.text}>atras</p>
      </button>
      <button
        type="button"
        className={buttonStyles.buttonForward}
        onClick={() => {
          router.forward();
        }}
      >
        <span className={`material-symbols-outlined ${buttonStyles.icon}`}>
          chevron_right
        </span>
        <p className={buttonStyles.text}>entrar</p>
      </button>
    </section>
  );
}
