/* eslint-disable no-unused-vars */
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
  SyntheticEvent,
} from 'react';

interface AccordionScrollContextType {
  expanded: string | false;
  // Now accepts the specific accordion ID and the parent Card ID
  handleAccordionChange: (
    panelId: string,
    cardId: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void;
  mainScrollRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const AccordionScrollContext = createContext<AccordionScrollContextType | null>(
  null,
);

export const useAccordionScroll = (): AccordionScrollContextType => {
  const context = useContext(AccordionScrollContext);

  if (!context) {
    throw new Error(
      'useAccordionScroll must be used within an AccordionScrollProvider',
    );
  }

  return context;
};

export const AccordionScrollProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleAccordionChange = useCallback(
    (panelId: string, cardId: string) => {
      return (event: SyntheticEvent, isExpanded: boolean) => {
        const scrollContainer = mainScrollRef.current;
        // Fallback to window scroll if the container isn't handling the overflow
        const currentScroll = scrollContainer
          ? scrollContainer.scrollTop
          : window.scrollY;

        setExpanded(isExpanded ? panelId : false);

        requestAnimationFrame(() => {
          if (scrollContainer) {
            if (scrollContainer.scrollTop === 0 && currentScroll > 0) {
              scrollContainer.scrollTop = currentScroll;
            }
          } else {
            if (window.scrollY === 0 && currentScroll > 0) {
              window.scrollTo(0, currentScroll);
            }
          }

          // Target the parent card using the cardId
          if (isExpanded && cardRefs.current[cardId]) {
            setTimeout(() => {
              cardRefs.current[cardId]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              });
            }, 150);
          }
        });
      };
    },
    [],
  );

  return (
    <AccordionScrollContext.Provider
      value={{
        expanded,
        handleAccordionChange,
        mainScrollRef,
        cardRefs,
      }}
    >
      {children}
    </AccordionScrollContext.Provider>
  );
};
