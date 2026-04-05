'use client';
import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useNavigationContext } from '#@/app/context/navigation-context';
import styles from '#@/lib/styles/navbar.module.css';

export const Drawer = ({ children }: { children: ReactNode }) => {
  const { isNavOpen, setIsNavOpen } = useNavigationContext();

  const wrapper = useRef(null);

  const overlay = useRef(null);

  const onDismiss = useCallback(() => {
    setIsNavOpen((n) => {
      return !n;
    });
  }, [setIsNavOpen]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) {
          onDismiss();
        }
      }
    },
    [onDismiss, overlay, wrapper],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    },
    [onDismiss],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      return document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  if (!isNavOpen) {
    return null;
  }

  return (
    <nav
      className={styles.drawer}
      onClick={onClick}
      ref={overlay}
    >
      <div
        className={styles.sidenav}
        ref={wrapper}
      >
        {children}
      </div>
    </nav>
  );
};
