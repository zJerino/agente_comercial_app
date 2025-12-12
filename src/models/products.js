import { useLocalStorage } from "react-use";
import { schema, dbName as productsDB } from '../configs/products';
import { tryParseJSON } from '../configs/utils';

export const ProductsModel = () => {
    /**
     * Datos
     */
    const [ raw, setValue ] = useLocalStorage(productsDB, "[]");
    const data = tryParseJSON(raw) || [];
    const productsData = Array.isArray(data) ? data : [];

    return {
        /**
         * Devuelve el total de objetos en la db
         */
        getTotal: () => productsData.length,
        
        /**
         * Devuelve todos los objetos
         */
        getAll: () => [...productsData],

        /**
         * Una manera de buscar 1 producto por uno de sus atributos exactos
         */
        product: (value, key = 'id') => productsData.find((item) => {
            item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
            return item[key] === value;
        }),

        /**
         * Crea objetos
         */
        create: (fields = {}) => {
            if (typeof fields !== 'object') return false;

            // Se agrega el esquema al objeto
            fields = Object.assign({...schema}, fields, {createdAt: (new Date()).getTime()});
            
            // Se agrega el nuevo objeto al almacenamiento
            const newData = [...productsData, fields];
            setValue(JSON.stringify(newData));
            
            return true;
        },
        
        /**
         * Una manera de borrar 1 producto por uno de sus atributos exactos
         */
        delete: (value, key = 'id') => {
            setValue(
                JSON.stringify(
                    productsData.filter((item) => {
                        item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
                        return item[key] !== value;
                    })
                )
            );
        },

        /**
         * Crea una lista de los objetos que cumplen con la busqueda
         */
        searchList: (value, keys = ['name', 'description']) => {
            return productsData.filter((item) => {
                item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
                let valid = false;

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (typeof item[key] === 'string' && String(item[key].toLowerCase()).includes(String(value).toLowerCase())) valid = true;
                    if (typeof item[key] === 'number' && item[key] === value) valid = true;
                }

                return valid;
            })
        },
    }
}