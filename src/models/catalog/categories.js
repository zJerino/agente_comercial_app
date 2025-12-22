/**
 * Modelo para manejar varios clientes (Prototipo)
 */
import { useEffect, useState } from 'react';
import { DBInstance as DB } from '../../classes/database';
import { schema, dbName } from '../../configs/catalog_categories';

/**
 * Esquema de los datos
 */
export const ClientSchema = {
    images: [],
    ...schema
};

/**
 * Modelo principal
 */
export default function Main() {
    /**
     * Estados
     */
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    /**
     * Respuesta
     */
    return {
        loaded: !loading, // Indica si la carga ha terminado
        getTotal: data != null ? (Array.isArray(data) ? data.length : 0) : 0, // Inidica cuantos objetos hay
        error: error, // Inidica el error si hay alguno
        data: data, // Devuelve los datos

        /**
         * Elimina toda la lista de objetos
         */
        delete: () => (new Promise(async (resolve, reject) => {
            try {
                let results = [];                
                if (Array.isArray(data) && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        let result = await DB.update(dbName, item.id);

                        results.push({
                            id: item.id,
                            result: result
                        });
                    }
                }
                resolve(results);
            } catch(e) {
                reject(e);
            }
        })),

        /**
         * Genera la lista de datos apartir de la busqueda
         */
        list: async (fn) => {
            setLoading(true);
            
            let r = await (new Promise(async (r, re) => {
                DB.search(dbName, fn).then(res => {
                    if (Array.isArray(res)) {
                        return r(res.map((item) => {
                            /* if (Array.isArray(item.images) && item..length === 2 && typeof item.businessImg[1] === 'object' && item.businessImg[1].constructor.name === 'ArrayBuffer') {

                                let newBlob = new Blob([item.businessImg[1]], {type: item.businessImg[0]});
                                
                                item.businessImg = URL.createObjectURL(newBlob);
                            } */
                            return item;
                        }));
                    } else {
                        r([])
                    }
                }).catch(err => {
                    setError(err);
                    re(err);
                });
            }));

            if (Array.isArray(r)) setData(r);
            setLoading(false);            
        }
    }
}

/**
 * Este es un hook para contar todos los objetos de la colecion
 */
export const GetTotal = () => {
    const [ refresh, setRefresh ] = useState(false);
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        DB.count(dbName).then(c => setCount(c)).catch((e) => setCount(-1));
    }, [refresh]);

    return [count, () => setRefresh(!refresh)];
}