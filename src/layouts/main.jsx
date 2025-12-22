/**
 * Estilo principal
 * Consiste:
 * + Una barra superior con el Nombre de la APP, boton de retroseso y lupa de busqueda
 * + Una barra inferior con la nevegacion (Clientes, Ordenes & Catalogo)
 * + Y contiene en el centro el contenido de las paginas (Rutas)
 */
import TopBar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { Outlet } from 'react-router';
import { useState, useMemo } from 'react';

let APP_NAME = (typeof process.env.REACT_APP_NAME === 'string' ? process.env.REACT_APP_NAME : 'AgenteComercialApp');

export default function Main({titleType, title = APP_NAME, back, menu, search = false, database}) {
    const [titleState, setTitle] = useState(title);
    const [searchVal, setSearchVal] = useState('');
    const [searchState, setSearchState] = useState(false);
    
    const searchDef = useMemo(() => {
        if (search) {
            return {
                onchange: (val) => {
                    setSearchVal(val);
                },
                state: [searchState, setSearchState],
            }
        }
        return null;
    // eslint-disable-next-line
    }, [search, searchState]);

    function restSearch() {
        setSearchVal('');
        setSearchState(false);
    }
    
    const TopbarFixed = useMemo(() => {
        if (titleType !== 'in-content') return <TopBar titleType={titleType} back={back} menu={menu} search={searchDef} title={titleState}/>;
        return <></>;
    }, [titleType, back, menu, searchDef, titleState]);
    
    const TopbarStatic = useMemo(() => {
        if (titleType === 'in-content') return <TopBar titleType="none" back={back} menu={menu} search={searchDef} title={titleState}/>;
        return <></>;
    }, [titleType, back, menu, searchDef, titleState]);

    const Content = useMemo(() => <Outlet context={{searchVal, searchState, restSearch, setTitle}} />, [searchVal, searchState]);

    return (
        <div className="flex flex-col h-[100svh] z-[120]">
            {TopbarFixed}

            <div className="flex-grow-[1] relative overflow-y-auto z-[100]">
                {TopbarStatic}

                {Content}
            </div>
            
            <BottomBar restSearch={restSearch} search={searchVal} />
        </div>
    );
}