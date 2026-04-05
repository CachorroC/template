'use client';

import { useModalContext } from '#@/app/context/ModalContext';
import styles from '#@/lib/styles/modal.module.css';
import { usePathname, useRouter } from 'next/navigation';
import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

export function Modal({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { setIsModalOpen } = useModalContext();

  const overlay = useRef(null);

  const wrapper = useRef(null);

  const router = useRouter();

  const onDismiss = useCallback(() => {
    console.log('onDismiss');
    setIsModalOpen(false);
    router.back();
  }, [router, setIsModalOpen]);

  const onBackspace = useCallback(() => {
    console.log('on backspace');
    setIsModalOpen(false);
    router.back();
  }, [router, setIsModalOpen]);

  const onEnter = useCallback(() => {
    setIsModalOpen(false);
    router.forward();
  }, [router, setIsModalOpen]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      console.log('onCLick');

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
      console.log('onKeyDown');

      if (e.key === 'Enter') {
        onEnter();
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        onBackspace();
      }
    },
    [onBackspace, onEnter],
  );

  useEffect(() => {
    console.log('on useEffect');
    document.addEventListener('keydown', onKeyDown);

    return () => {
      return document.removeEventListener('keydown', onKeyDown);
    };
  }, [pathname, onKeyDown]);

  return (
    <div
      ref={overlay}
      className={styles.open}
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className={styles.wrapper}
      >
        {children}
      </div>
    </div>
  );
}
