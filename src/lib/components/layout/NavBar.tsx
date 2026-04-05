'use client';
import styles from 'styles/layout.module.css';
import { useNavigationContext } from '#@/app/context/navigation-context';
import { Drawer } from './Drawer';
import { NavLink } from './NavLink';
import { Route } from 'next';
import { Loader } from '../Loader/loader';
import { Suspense } from 'react';
import { DrawerMenuButton } from '../buttons/nav-buttons';
import ThemeToggle from '../ThemeToggle';

export const NavBar = () => {
  const { isNavOpen } = useNavigationContext();

  return (
    <div className={styles.header}>
      <NavLink
        key={'home'}
        iconLabel={'home'}
        textLabel={'Inicio'}
        hrefLabel={'/'}
      />
      <NavLink
        iconLabel={'cannabis'}
        textLabel={'Nueva Hierba en el compendio'}
        hrefLabel={'/hierba/nueva' as Route}
      />
      <NavLink
        iconLabel={'potted_plant'}
        textLabel={'Hierbas del compendio'}
        hrefLabel={'/hierbas'}
      />
      <DrawerMenuButton />
      {isNavOpen && (
        <Suspense fallback={<Loader />}>
          <Drawer>
            <DrawerMenuButton />
            <ThemeToggle />
            <NavLink
              iconLabel={'cannabis'}
              textLabel={'Nueva Hierba en el compendio'}
              hrefLabel={'/hierba/nueva' as Route}
            />
            <NavLink
              iconLabel={'potted_plant'}
              textLabel={'Hierbas del compendio'}
              hrefLabel={'/hierbas'}
            />
          </Drawer>
        </Suspense>
      )}
    </div>
  );
};
