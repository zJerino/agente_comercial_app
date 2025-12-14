import { Suspense, useMemo } from 'react';
import { Routes, Route } from "react-router";
import RoutesList from './configs/routes';
import { LoaderFull } from './components/Loading';

/**
 * Esquema de como debe definirse las rutas en la configuracion de rutas
 */
const routesSchema = {
  path: '',
  element: <></>,
  options: {
      index: false
  },
  children: []
};

/**
 * Resuelve y devuelve los hijos de las rutas de forma recursiva.
 */
function children(oitem) {
  let item = {...routesSchema, ...oitem};

  // Mapear los hijos recursivamente
  let Childs = item.children.map((Child) => {
    Child = Object.assign({...routesSchema}, Child);

    // Llamada recursiva para rutas anidadas
    if (Child.children.length > 0) {
      return children(Child);
    } else {
      if (Child.options.index === true) {
        return (<Route element={Child.element} index key={Child.path || 'index'}/>); // Añadimos key
      } else {
        return (<Route path={Child.path} element={Child.element} key={Child.path} />); // Añadimos key
      }
    }
  })

  if (item.path.length > 0) {
    return (
      <Route path={item.path} element={item.element} key={item.path}>
        {Childs}
      </Route>
    );
  } else {
    return (
      <Route element={item.element} key={item.path || 'layout'}>
        {Childs}
      </Route>
    );
  }
}

/**
 * Componente princial de la App
 */
function App() {
  const Rou = useMemo(() => {
    return RoutesList.map((R) => {
      if (R.children.length > 0) {
        return children(R);
      } else if (R.options.index === true) {
        return <Route index element={R.element} key={R.path || 'top-index'}/>      
      } else {
        return <Route path={R.path} element={R.element} key={R.path} />      
      }
    });
  }, []);
  
  return (
    <Suspense fallback={<LoaderFull />}>
      <Routes>
        {Rou}
      </Routes>
    </Suspense>
  );
}

export default App;