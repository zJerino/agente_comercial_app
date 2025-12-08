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

export default function Main() {
    return (
        <div className="flex flex-col h-[100svh]">
            <TopBar />

            <div className="flex-grow-[1]">
                <Outlet />
            </div>
            
            <BottomBar />
        </div>
    );
}