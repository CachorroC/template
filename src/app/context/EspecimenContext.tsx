'use client';
import { EspecimenType } from '#@/lib/types/especimenTypes';
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useEffect,
} from 'react';

// --- State & Action Types ---
interface EspecimenState {
  data: EspecimenType[];
  filteredData: EspecimenType[];
  searchName: string;
  searchDolor: string;
  filterProperty: string;
  sortOrder: 'ASC' | 'DESC' | 'NONE';
}

type Action =
  | { type: 'INIT_DATA'; payload: EspecimenType[] }
  | { type: 'SET_SEARCH_NAME'; payload: string }
  | { type: 'SET_SEARCH_DOLOR'; payload: string }
  | { type: 'SET_FILTER_PROPERTY'; payload: string }
  | { type: 'SET_SORT'; payload: 'ASC' | 'DESC' | 'NONE' }
  | { type: 'RESET_FILTERS' };

// --- Helper Functions ---

const normalizeText = (text: string | undefined | null): string => {
  if (!text) {
    return '';
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const applyCriteria = (state: EspecimenState): EspecimenType[] => {
  let result = [...state.data];

  // 1. Apply Search by Name (Scientific and Common names)
  if (state.searchName) {
    const normalizedNameSearch = normalizeText(state.searchName);

    result = result.filter((e) => {
      const matchCientifico = normalizeText(e.nombreCientifico).includes(
        normalizedNameSearch,
      );

      const safeNombresComunes = e.nombresComunes || [];

      const matchComunes = safeNombresComunes.some((nombre) => {
        return normalizeText(nombre).includes(normalizedNameSearch);
      });

      return matchCientifico || matchComunes;
    });
  }

  // 2. Apply Search by Illness/Dolor (malesFisicos)
  if (state.searchDolor) {
    const normalizedDolorSearch = normalizeText(state.searchDolor);

    result = result.filter((e) => {
      const safeMalesFisicos = e.malesFisicos || [];

      return safeMalesFisicos.some((mal) => {
        return normalizeText(mal).includes(normalizedDolorSearch);
      });
    });
  }

  // 3. Apply Filter (e.g., filtering by 'propiedadesMedicinales')
  if (state.filterProperty) {
    result = result.filter((e) => {
      const safePropiedades = e.propiedadesMedicinales || [];

      return safePropiedades.includes(state.filterProperty);
    });
  }

  // 4. Apply Sort (Alphabetically by nombreCientifico)
  if (state.sortOrder !== 'NONE') {
    result.sort((a, b) => {
      const nameA = (a.nombreCientifico || '').toLowerCase();
      const nameB = (b.nombreCientifico || '').toLowerCase();

      if (state.sortOrder === 'ASC') {
        return nameA.localeCompare(nameB);
      }

      return nameB.localeCompare(nameA);
    });
  }

  return result;
};

// --- Reducer ---
const especimenReducer = (
  state: EspecimenState,
  action: Action,
): EspecimenState => {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case 'INIT_DATA':
      newState.data = action.payload;

      break;

    case 'SET_SEARCH_NAME':
      newState.searchName = action.payload;

      break;

    case 'SET_SEARCH_DOLOR':
      newState.searchDolor = action.payload;

      break;

    case 'SET_FILTER_PROPERTY':
      newState.filterProperty = action.payload;

      break;

    case 'SET_SORT':
      newState.sortOrder = action.payload;

      break;

    case 'RESET_FILTERS':
      newState.searchName = '';
      newState.searchDolor = '';
      newState.filterProperty = '';
      newState.sortOrder = 'NONE';

      break;

    default:
      return state;
  }

  newState.filteredData = applyCriteria(newState);

  return newState;
};

// --- Context Setup ---
interface ContextProps {
  state: EspecimenState;
  dispatch: Dispatch<Action>;
}

const EspecimenContext = createContext<ContextProps | null>(null);

export const EspecimenProvider = ({
  children,
  initialEspecimens,
}: {
  children: ReactNode;
  initialEspecimens: EspecimenType[];
}) => {
  const initialState: EspecimenState = {
    data: [...initialEspecimens],
    filteredData: [...initialEspecimens],
    searchName: '',
    searchDolor: '',
    filterProperty: '',
    sortOrder: 'NONE',
  };

  const [state, dispatch] = useReducer(especimenReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'INIT_DATA',
      payload: initialEspecimens,
    });
  }, [initialEspecimens]);

  return (
    <EspecimenContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EspecimenContext.Provider>
  );
};

// --- Custom Hook ---
export const useEspecimen = () => {
  const context = useContext(EspecimenContext);

  if (!context) {
    throw new Error('useEspecimen must be used within an EspecimenProvider');
  }

  return context;
};
