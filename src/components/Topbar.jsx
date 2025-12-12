import { lazy, Suspense, useState } from "react";
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
  const [ internalState, setInternalState ] = useState(false);
  const [searchClose, setSearchClose] = (search != null && typeof search === 'object' && Array.isArray(search.state) && search.state.length === 2 && typeof search.state[1] === 'function' ? search.state : [ internalState, setInternalState ]);

  const BackButton = back ? (<i className="bi bi-chevron-left cursor-pointer transition-colors hover:text-gray-600" onClick={() => navigate(back)} aria-label="Volver a la página anterior" ></i>) : null;

  const MenuButton = Array.isArray(menu) ? (
    <div className="absolute right-[1rem] z-10">
      <Suspense fallback={<i className="bi bi-three-dots"></i>}>
        <Dropdown
          items={menu}
          btnclass="text-shadow-custom-topbar text-black"
        />
      </Suspense>
    </div>
  ) : null;

  let titleStyleClasses = "font-semibold text-primary text-2xl";

  if (titleType === 'center') {
    titleStyleClasses = "font-semibold text-black text-xl text-center flex-grow";
  }

  const TitleElement = titleType !== 'none' ? (
    <h4 className={titleStyleClasses}>{title}</h4>
  ) : null;

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

  /**
   * Boton de busqueda
   */
  let searchBtn;
  if (search != null && typeof search === 'object') {
    search = Object.assign({ ...searchSchema }, search);
    if (typeof search.onchange === 'function') {
      searchBtn = (
        <i className="bi bi-search cursor-pointer transition-colors hover:text-gray-600" onClick={() => setSearchClose(!searchClose)} aria-label="Search"></i>
      );
    }
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
      {searchBtn ? (<SearchCom onClose={() => setSearchClose(false)} onUpdate={search.onchange} show={searchClose} />) : ''}
    </div>
  );
}