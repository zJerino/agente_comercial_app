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

export default function Main({titleType, back, menu}) {
    return (
        <div className="flex flex-col h-[100svh] z-[120]">
            <TopBar titleType={titleType} back={back} menu={menu}/>            

            <div className="flex-grow-[1] relative overflow-y-auto z-[100]">
                <Outlet />
            </div>
            
            <BottomBar />
        </div>
    );
}