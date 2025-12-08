import { Routes, Route } from "react-router";
import RoutesList from './configs/routes';

// import logo from './logo.svg';
import './App.css';

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
 * Resuelve y devuelve los hijos de las rutas
 */
function children(oitem) {
  let item = {...routesSchema};
  Object.assign(item, oitem);

  let Childs = item.children.map((Child) => {
    Child = Object.assign({...routesSchema}, Child);
    if (Child.children.length > 0) {
      return children(Child);
    } else {
      if (Child.options.index === 1) {
        return (<Route element={Child.element} index/>);
      } else {
        return (<Route path={Child.path} element={Child.element} />);        
      }
    }
  })
  
  if (item.path.length > 0) {
    return (
      <Route path={item.path} element={item.element}>
        {Childs}
      </Route>
    );
  } else {
    return (
      <Route element={item.element}>
        {Childs}
      </Route>
    );
  }
}

function App() {
  let Rou = RoutesList.map((R) => {
    if (R.children.length > 0) {
      return children(R);
    } else if (R.options.index === 1) {
      return <Route index element={R.element} />      
    } else {
      return <Route path={R.path} element={R.element} />      
    }
  })
  
  return (
    <Routes>
      {Rou}
    </Routes>
  );
}

export default App;
