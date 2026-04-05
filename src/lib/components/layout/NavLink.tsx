'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useNavigationContext } from '#@/app/context/navigation-context';
import { Route } from 'next';
import buttonStyles from '#@/lib/styles/buttons.module.css';

export function NavLink<T extends string>({
  hrefLabel,
  iconLabel,
  textLabel,
}: {
  iconLabel: string;
  textLabel: string;
  hrefLabel: Route<T> | URL;
}) {
  const { isNavOpen, setIsNavOpen } = useNavigationContext();

  const pathname = usePathname();

  const isActive = pathname === hrefLabel;

  return (
    <Link
      key={hrefLabel.toString()}
      className={
        isActive
          ? isNavOpen
            ? buttonStyles.linkOpenActive
            : buttonStyles.linkActive
          : isNavOpen
            ? buttonStyles.linkOpen
            : buttonStyles.link
      }
      onClick={() => {
        setIsNavOpen(false);
      }}
      href={hrefLabel as Route}
    >
      <span className={`material-symbols-outlined ${buttonStyles.icon}`}>
        {iconLabel}
      </span>
      <h1 className={buttonStyles.text}>{textLabel}</h1>
    </Link>
  );
}
