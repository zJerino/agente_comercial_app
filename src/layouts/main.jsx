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
import { useState } from 'react';

export default function Main({titleType, title, back, menu, search = false}) {
    const [searchVal, setSearchVal] = useState('');

    let searchDef = null;
    if (search) {
        searchDef = {
            onchange: (val) => {
                setSearchVal(val);
            }
        }
    }
    
    return (
        <div className="flex flex-col h-[100svh] z-[120]">
            {titleType !== 'in-content' ? <TopBar titleType={titleType} back={back} menu={menu} search={searchDef} title={title}/> : ''}

            <div className="flex-grow-[1] relative overflow-y-auto z-[100]">
                {titleType === 'in-content' ? <TopBar titleType="none" back={back} menu={menu} search={searchDef} title={title}/> : ''}
                <Outlet context={{searchVal}} />
            </div>
            
            <BottomBar />
        </div>
    );
}