import { lazy } from 'react';
import { Outlet } from 'react-router';
import MainLayout from '../layouts/main';
import FormsLayout from '../layouts/forms';

import Home from '../routes/home';
import NoFound from '../routes/404';

/**
 * Contenedor de rutas
 */
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
const ClientsIndex = lazy(() => import('../routes/clients/index'));
const ClientsNew = lazy(() => import('../routes/clients/new'));
const ClientsView = lazy(() => import('../routes/clients/view'));

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
            element: <MainLayout titleType="none" back='/clients'/>,
            children: [
                {
                    path: 'overview',
                    element: <ClientsView />
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