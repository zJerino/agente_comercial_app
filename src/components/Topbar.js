import { lazy } from "react";
import { useNavigate } from "react-router";

/**
 * Componente | AppHeader
 */

export default function TopBar({title = 'AgenteComercialApp', titleType = 'normal', back = null, menu = null}) {
  const navigate = useNavigate();

  /**
   * Forma del titulo
   */
  let titleStyle = <h4 className="font-[600] text-primary text-[1.85rem]">{title}</h4>;

  if (titleType === 'center') {
    titleStyle = <h4 className="font-[600] text-black text-[1.25rem] text-center">{title}</h4>;
  }

  /**
   * Sistema de retroseso
   */

  let backBtn = <></>;

  if (back != null) {
    backBtn = <i className="bi bi-chevron-left absolute p-2" onClick={() => navigate(back)}></i>;
  }

  /**
   * Menu
   */
  let menuBtn = '';
  if (Array.isArray(menu)) {
    let Drop = lazy(() => import('./Dropdown'));
    menuBtn = (
      <Drop items={menu} className="absolute right-[1rem]" btnclass="text-shadow-custom-topbar text-black"/>
    );
  }

  if (titleType === 'none') {
    return (
      <div className="absolute px-3 py-2 w-full z-[120] text-shadow-custom-topbar">
        <div className="px-2 py-5 flex items-center">
          {backBtn}
          {menuBtn}
        </div>
      </div>
    );
  }
  return (
    <div className="border-b-[1px] shadow-none px-3 py-2">
      <div className="px-2 py-1 flex items-center">
        {backBtn}
        {titleStyle}
      </div>
    </div>
  );
}