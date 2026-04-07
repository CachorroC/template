'use client';
import { TemplateType } from '#@/lib/types/template';
import React, { createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect, } from 'react';

// --- State & Action Types ---
interface TemplateState {
  data          : TemplateType[];
  filteredData  : TemplateType[];
  searchName    : string;
  searchFilter  : string;
  filterProperty: string;
  sortOrder     : 'ASC' | 'DESC' | 'NONE';
}

type Action =
  | { type: 'INIT_DATA'; payload: TemplateType[] }
  | { type: 'SET_SEARCH_NAME'; payload: string }
  | { type: 'SET_SEARCH_FILTER'; payload: string }
  | { type: 'SET_FILTER_PROPERTY'; payload: string }
  | { type: 'SET_SORT'; payload: 'ASC' | 'DESC' | 'NONE' }
  | { type: 'RESET_FILTERS' };

// --- Helper Functions ---

const normalizeText = (
  text: string | undefined | null 
): string => {
  if ( !text ) {
    return '';
  }

  return text
    .normalize(
      'NFD' 
    )
    .replace(
      /[\u0300-\u036f]/g, '' 
    )
    .toLowerCase();
};

const applyCriteria = (
  state: TemplateState 
): TemplateType[] => {
  let result = [
    ...state.data
  ];

  // 1. Apply Search by Name
  if ( state.searchName ) {
    const normalizedNameSearch = normalizeText(
      state.searchName 
    );

    result = result.filter(
      (
        e 
      ) => {
        const matchTitle = normalizeText(
          e.title 
        ).includes(
          normalizedNameSearch,
        );

        const safeTags = e.tags || [];

        const matchTags = safeTags.some(
          (
            tag 
          ) => {
            return normalizeText(
              tag 
            ).includes(
              normalizedNameSearch 
            );
          } 
        );

        return matchTitle || matchTags;
      } 
    );
  }

  // 2. Apply Search by Filter/Categories
  if ( state.searchFilter ) {
    const normalizedFilterSearch = normalizeText(
      state.searchFilter 
    );

    result = result.filter(
      (
        e 
      ) => {
        const safeCategories = e.categories || [];

        return safeCategories.some(
          (
            cat 
          ) => {
            return normalizeText(
              cat 
            ).includes(
              normalizedFilterSearch 
            );
          } 
        );
      } 
    );
  }

  // 3. Apply Property Filter
  if ( state.filterProperty ) {
    result = result.filter(
      (
        e 
      ) => {
        const safeAttributes = e.attributes || [];

        return safeAttributes.includes(
          state.filterProperty 
        );
      } 
    );
  }

  // 4. Apply Sort
  if ( state.sortOrder !== 'NONE' ) {
    result.sort(
      (
        a, b 
      ) => {
        const nameA = ( a.title || '' ).toLowerCase();
        const nameB = ( b.title || '' ).toLowerCase();

        if ( state.sortOrder === 'ASC' ) {
          return nameA.localeCompare(
            nameB 
          );
        }

        return nameB.localeCompare(
          nameA 
        );
      } 
    );
  }

  return result;
};

// --- Reducer ---
const templateReducer = (
  state: TemplateState,
  action: Action,
): TemplateState => {
  const newState = {
    ...state,
  };

  switch ( action.type ) {
      case 'INIT_DATA':
        newState.data = action.payload;

        break;

      case 'SET_SEARCH_NAME':
        newState.searchName = action.payload;

        break;

      case 'SET_SEARCH_FILTER':
        newState.searchFilter = action.payload;

        break;

      case 'SET_FILTER_PROPERTY':
        newState.filterProperty = action.payload;

        break;

      case 'SET_SORT':
        newState.sortOrder = action.payload;

        break;

      case 'RESET_FILTERS':
        newState.searchName = '';
        newState.searchFilter = '';
        newState.filterProperty = '';
        newState.sortOrder = 'NONE';

        break;

      default:
        return state;
  }

  newState.filteredData = applyCriteria(
    newState 
  );

  return newState;
};

// --- Context Setup ---
interface ContextProps {
  state   : TemplateState;
  dispatch: Dispatch<Action>;
}

const TemplateContext = createContext<ContextProps | null>(
  null 
);

export const TemplateProvider = (
  {
    children,
    initialData,
  }: {
    children   : ReactNode;
    initialData: TemplateType[];
  } 
) => {
  const initialState: TemplateState = {
    data: [
      ...initialData
    ],
    filteredData: [
      ...initialData
    ],
    searchName    : '',
    searchFilter  : '',
    filterProperty: '',
    sortOrder     : 'NONE',
  };

  const [
    state,
    dispatch
  ] = useReducer(
    templateReducer, initialState 
  );

  useEffect(
    () => {
      dispatch(
        {
          type   : 'INIT_DATA',
          payload: initialData,
        } 
      );
    }, [
      initialData
    ] 
  );

  return (
    <TemplateContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

// --- Custom Hook ---
export const useTemplate = () => {
  const context = useContext(
    TemplateContext 
  );

  if ( !context ) {
    throw new Error(
      'useTemplate must be used within a TemplateProvider' 
    );
  }

  return context;
};
