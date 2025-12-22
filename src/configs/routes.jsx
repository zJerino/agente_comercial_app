import { lazy } from 'react';
import { Outlet } from 'react-router';
import MainLayout from '../layouts/main';
import FormsLayout from '../layouts/forms';

import Home from '../routes/home';
import NoFound from '../routes/404';

const OutletWrapper = () => <Outlet />; 

/**
 * Contenedor de rutas
 */
const routes = [];

/**
 * Rutas de basicas
 */

routes.push({
    path: '/',
    element: MainLayout,
    options: { index: false },
    children: [
        {
            path: '/',
            element: Home,
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
    element: OutletWrapper,
    options: { index: false },
    children: [
        {
            path: 'new',
            element: MainLayout,
            props: { back: '/clients', titleType: 'in-content' },
            children: [
                {
                    element: ClientsNew,
                    options: {index: true}
                }
            ]
        },
        {
            path: ':id',
            element: MainLayout,
            props: { titleType: "none", back: '/clients', menu: [{ text: 'Borrar cliente', icon: 'trash', modal: 'modal-delete' } ]},
            children: [
                {
                    path: 'overview',
                    element: ClientsView
                }
            ]
        },
        {
            element: MainLayout,
            props: { search: true },
            options: {
                index: true
            },
            children: [
                {
                    element: ClientsIndex,
                    options: {index: true}
                }
            ]
        }
    ]
});

/**
 * Rutas de catalogo
 */
const CatalogIndex = lazy(() => import('../routes/catalog/index'));
const CatalogNew = lazy(() => import('../routes/catalog/new'));

const ProductNew = lazy(() => import('../routes/catalog/products/new'));
const ProductView = lazy(() => import('../routes/catalog/products/view'));

const CategoryNew = lazy(() => import('../routes/catalog/categories/new'));
const CategoryView = lazy(() => import('../routes/catalog/categories/view'));
const CategoryAdd = lazy(() => import('../routes/catalog/categories/add'));

routes.push({
    path: '/catalog',
    element: OutletWrapper,
    options: { index: false },
    children: [
        {
            path: 'new',
            element: MainLayout,
            props: { titleType: "none", back: '/catalog' },
            options: {index: false},
            children: [
                {
                    element: CatalogNew,
                    options: {index: true}
                }
            ]
        },

        
        {
            path: 'product/new',
            element: FormsLayout,
            options: {index: false},
            children: [
                {
                    element: ProductNew,
                    options: {index: true}
                }
            ]
        },
        {
            path: 'product/:id',
            element: MainLayout,
            props: { titleType: "in-content", back: '/catalog', menu: [{ text: 'Borrar', icon: 'trash', modal: 'modal-delete' } ]},
            children: [
                {
                    element: ProductView,
                    options: {index: true}                    
                }
            ]
        },
        
        {
            path: 'category/new',
            element: FormsLayout, 
            props: { titleType: "none", back: '/catalog' },
            options: {index: false},
            children: [
                {
                    element: CategoryNew,
                    options: {index: true}
                }
            ]
        },
        {
            path: 'category/:id',
            element: MainLayout, 
            props: { search: true, titleType: "center", back: '/catalog', menu: [{ text: 'Agregar producto', icon: 'plus', link: './add' }, { text: 'Borrar', icon: 'trash', modal: 'modal-delete' }]},
            options: {index: false},
            children: [
                {
                    path: 'add',
                    element: CategoryAdd
                },
                {
                    element: CategoryView,
                    options: {index: true}
                }
            ]
        },

        {
            element: MainLayout,
            props: { search: true },
            options: {
                index: true
            },
            children: [
                {
                    element: CatalogIndex,
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
    element: NoFound,
    options: { index: false },
    children: []
});

export default routes;