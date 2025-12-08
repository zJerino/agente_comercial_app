/**
 * Estilo para formularios
 * Consiste:
 * + Una barra superior con un titulo personalizado, boton de retroseso
 * + Una barra inferior con la nevegacion (Clientes, Ordenes & Catalogo)
 * + Y contiene en el centro el contenido de las paginas (Rutas)
 */

import TopBar from '../components/Topbar';
import BottomBar from '../components/BottomBar';
import { Outlet } from 'react-router';

export default function Main({title, back}) {
    return (
        <div className="flex flex-col h-[100svh]">
            <TopBar title={title} titleType="none" back={back} />

            <div className="flex-grow-[1] relative overflow-y-auto z-[100]">
                <Outlet />
            </div>
            
            <BottomBar />
        </div>
    );
}