import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { Routes, Route } from "react-router";
import RoutesList from './configs/routes';
import { LoaderFull } from './components/Loading';
import DB_CONFIG from './configs/database';
import DBC from './classes/database';

/**
 * Creamos el objeto de la base de datos
 */
const DATABASEO = DBC.getInstance(DB_CONFIG);

/**
 * Esquema de como debe definirse las rutas en la configuracion de rutas
 */
const routesSchema = {
  path: '',
  element: null,
  props: {},
  options: {
    index: false
  },
  children: []
};

/**
 * Resuelve y devuelve los hijos de las rutas de forma recursiva.
 */

function children(oitem) {
  let Item = { ...routesSchema, ...oitem };

  const ParentElement = React.createElement(Item.element, { ...Item.props });
  const Childs = Item.children.map((Child) => {
    Child = Object.assign({ ...routesSchema }, Child);

    // Llamada recursiva para rutas
    if (Child.children.length > 0) {
      return children(Child);
    } else {
      const ChildElement = React.createElement(Child.element, { ...Child.props });

      if (Child.options.index === true) {
        return (<Route element={ChildElement} index key={Child.path || 'index'} />);
      } else {
        return (<Route path={Child.path} element={ChildElement} key={Child.path} />);
      }
    }
  })

  if (Item.path.length > 0) {
    return (
      <Route path={Item.path} element={ParentElement} key={Item.path}>
        {Childs}
      </Route>
    );
  } else {
    return (
      <Route element={ParentElement} key={Item.path || 'layout'}>
        {Childs}
      </Route>
    );
  }
}

/**
 * Componente princial de la App
 */
function App() {
  /**
   * Base de datos
   */
  const [status, setStatus] = useState(null);

  // Inicialización al montar el componente (Simula el inicio de la app)
  useEffect(() => {
    const initDB = async () => {
      try {
        await DATABASEO.init();
        setStatus(true);
      } catch (err) {
        setStatus(false);
      }
    };
    initDB();
  }, []);

  const Rou = useMemo(() => {
    return RoutesList.map((R) => {
      if (R.children.length > 0) {
        return children(R);
      }

      const RElement = React.createElement(R.element, {...R.props});

      if (R.options.index === true) {
        return <Route index element={RElement} key={R.path || 'top-index'} />
      } else {
        return <Route path={R.path} element={RElement} key={R.path} />
      }
    });
  }, []);

  /**
   * Pantalla de carga de base de datos
   */
  if (status === null) return <LoaderFull sub='Estamos cargando tus datos' />;

  return (
    <Suspense fallback={<LoaderFull />}>
      <Routes>
        {Rou}
      </Routes>
    </Suspense>
  );
}

export default App;