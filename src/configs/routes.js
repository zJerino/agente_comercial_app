import { Outlet } from 'react-router';
import MainLayout from '../layouts/main';
import FormsLayout from '../layouts/forms';
import Home from '../routes/home';
import ClientsIndex from '../routes/clients/index';
import ClientsNew from '../routes/clients/new';
import ClientsView from '../routes/clients/view';
import NoFound from '../routes/404';
const routes = [];

/**
 * Rutas de basicas
 */

routes.push({
    path: '/',
    element: <MainLayout />,
    options: { index: false },
    children: [
        {
            path: '/',
            element: <Home />,
            options: {
                index: true
            }
        }
    ]
});

/**
 * Rutas de clientes
 */

routes.push({
    path: '/clients',
    element: <Outlet />,
    options: { index: false },
    children: [
        {
            path: 'new',
            element: <FormsLayout title="Nuevo cliente" back='/clients' />,
            options: {index: false},
            children: [
                {
                    element: <ClientsNew />,
                    options: {index: true}
                }
            ]
        },
        {
            path: ':id',
            element: <MainLayout title="Nuevo cliente" back='/clients' />,
            options: {index: false},
            children: [
                {
                    element: <ClientsView />,
                    options: {index: true}
                }
            ]
        },

        {
            element: <MainLayout />,
            options: {
                index: true
            },
            children: [
                {
                    element: <ClientsIndex />,
                    options: {index: true}
                }
            ]
        }
    ]
});

/**
 * Ruta para 404 [Ultima ruta en agregarse]
 */
routes.push({
    path: '*',
    element: <NoFound />,
    options: { index: false },
    children: []
});

export default routes;