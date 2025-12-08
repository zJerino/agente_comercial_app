import MainLayout from '../layouts/main';
import Home from '../routes/home';
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
 * Ruta para 404 [Ultima ruta en agregarse]
 */
routes.push({
    path: '*',
    element: <NoFound />,
    options: { index: false },
    children: []
});

export default routes;