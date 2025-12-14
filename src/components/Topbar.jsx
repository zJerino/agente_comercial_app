import { lazy, Suspense, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SearchCom from './SearchComponent';

const Dropdown = lazy(() => import('./Dropdown'));

/**
 * Esquema para usar boton de busqueda
 */
export const searchSchema = {
  text: '',
  icon: 'search',
  onchange: null,
  state: null
}

/**
 * Componente | Topbar
 */
export default function TopBar({ title, titleType = 'normal', back = null, menu = null, search = null }) {
  const navigate = useNavigate();
  const [ internalSearchState, setInternalSearchState ] = useState(false);

  const [searchClose, setSearchClose] = useMemo(() => {
    // Validamos si 'search' tiene la estructura de estado [value, set]
    const hasExternalState = ( search != null && typeof search === 'object' && Array.isArray(search.state) && search.state.length === 2 && typeof search.state[1] === 'function');
    
    return hasExternalState ? search.state : [ internalSearchState, setInternalSearchState ];
  }, [search, internalSearchState]); // Dependencia en search para detectar cambio de prop y en internalSearchState para que se actualice el memo cuando cambie el estado interno.
  
  const BackButton = useMemo(() => back ? (
    <i className="bi bi-chevron-left cursor-pointer transition-colors hover:text-gray-600" onClick={() => navigate(back)} aria-label="Volver a la página anterior" ></i>
  ) : null, [back, navigate]);

  const MenuButton = useMemo(() => Array.isArray(menu) ? (
    <div className="absolute right-[1rem] z-10">
      <Suspense fallback={<i className="bi bi-three-dots"></i>}>
        <Dropdown items={menu} btnclass="text-shadow-custom-topbar text-black" />
      </Suspense>
    </div>
  ) : null, [menu]);

  let titleStyleClasses = "font-semibold text-primary text-2xl";

  if (titleType === 'center') {
    titleStyleClasses = "font-semibold text-black text-xl text-center flex-grow";
  }

  const TitleElement = titleType !== 'none' ? (
    <h4 className={titleStyleClasses}>{title}</h4>
  ) : null;

  /**
   * Boton de busqueda
   */
  let searchBtn = null;
  let searchConfig = search;
  
  // Utilizamos useMemo para actualizar solo cuando se requiera
  const searchM = useMemo(() => {
    let button = null;
    let config = null;

    if (searchConfig != null && typeof searchConfig === 'object') {
        config = Object.assign({ ...searchSchema }, searchConfig);
        
        if (typeof config.onchange === 'function') {
            button = (
                <i 
                    className="bi bi-search cursor-pointer transition-colors hover:text-gray-600" 
                    onClick={() => setSearchClose(!searchClose)} 
                    aria-label="Search">
                </i>
            );
        }
    }
    return { button, config };
  }, [searchConfig, searchClose, setSearchClose]);

  searchBtn = searchM.button;
  searchConfig = searchM.config;

  if (titleType === 'none') {
    return (
      <div className="absolute top-0 left-0 p-2 w-full z-[120] text-shadow-custom-topbar">
        <div className="px-2 py-5 flex items-center justify-between">
          {BackButton}
          {MenuButton}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-3 py-2 relative top-0 z-50">
      <div className={`px-2 py-1 flex items-center ${titleType === 'center' ? 'justify-center' : 'justify-start'}`}>
        <div className="absolute left-0 pl-3">
          {BackButton}
        </div>

        {TitleElement}

        <div className="absolute right-0 pr-3">
          {searchBtn}
          {MenuButton}
        </div>
      </div>
      {searchBtn ? (<SearchCom onClose={() => setSearchClose(false)} onUpdate={searchConfig.onchange} show={searchClose} />) : null}
    </div>
  );
}