'use client';
import { useTemplate } from '#@/app/context/EspecimenContext';
import { useSearch } from '#@/app/context/search-context';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { bodyLarge } from '../styles/fonts/typography.module.css';
import { searchContainer } from '../styles/landing.module.css';
import searchbar from '../styles/searchbar.module.css';
import { Route } from 'next';

export const InputSearchBar = () => {
  const {
    search,
    setSearch
  } = useSearch();
  const {
    state,
    dispatch
  } = useTemplate();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className={searchContainer}>
      <datalist id="lista_hierbas">
        {state.data.map(
          (
            carpeta
          ) => {
            return (
              <option
                value={carpeta.title}
                key={carpeta.title}
                onClick={
                  () => {
                    return router.push(
                      `/shop/${ carpeta.title }` as Route
                    );
                  }
                }
              />
            );
          }
        )}
      </datalist>
      <input
        type={'text'}
        list="lista_hierbas"
        name={'search'}
        placeholder={'Buscar'}
        value={search}
        className={`${ bodyLarge } ${ searchbar.input }`}
        onChange={(
          e
        ) => {
          dispatch(
            {
              type   : 'SET_SEARCH_NAME',
              payload: e.target.value,
            }
          );

          return setSearch(
            e.target.value
          );
        }}
      />
      <select
        value={state.sortOrder}
        onChange={(
          e
        ) => {
          return dispatch(
            {
              type   : 'SET_SORT',
              payload: e.target.value as 'ASC' | 'DESC' | 'NONE',
            }
          );
        }}
      >
        <option value="NONE">Sort: None</option>
        <option value="ASC">A-Z</option>
        <option value="DESC">Z-A</option>
      </select>

      <button
        className={searchbar.icon}
        type="button"
        onClick={() => {
          setSearch(
            ''
          );
          dispatch(
            {
              type: 'RESET_FILTERS',
            }
          );
          const params = new URLSearchParams(
            searchParams.toString()
          );

          params.delete(
            'search'
          );
          router.replace(
            `${ pathname }?${ params.toString() }` as Route, {
              scroll: false,
            }
          );
        }}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};
