/**
 * Estilo principal
 * Consiste:
 * + Una barra superior con el Nombre de la APP, boton de retroseso y lupa de busqueda
 * + Una barra inferior con la nevegacion (Clientes, Ordenes & Catalogo)
 * + Y contiene en el centro el contenido de las paginas (Rutas)
 */
import AppHeader from '../components/AppHeader';
import BottomBar from '../components/BottomBar';
import { Outlet } from 'react-router';

export default function Main() {
    return (
        <div className="app-main">
            <AppHeader />
            <Outlet />
            <BottomBar />
        </div>
    );
}