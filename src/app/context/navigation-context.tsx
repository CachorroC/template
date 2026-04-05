'use client';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

const NavigationContext = createContext<{
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function NavigationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        isNavOpen,
        setIsNavOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (context === null) {
    throw new Error(
      'Navigation Context has to be used within a Navigationprovider',
    );
  }

  return context;
}
