import { useLocalStorage } from "react-use";
import { schema, dbName as clientDB } from '../configs/clients';
import { tryParseJSON } from '../configs/utils';

/**
 * Usamos un hook
 */
export const useClientModel = () => {
    /**
     * Datos
     */
    const [ raw, setValue ] = useLocalStorage(clientDB, "[]");
    const data = tryParseJSON(raw) || [];
    const clientsData = Array.isArray(data) ? data : [];


    return {
        /**
         * Devuelve el total de clientes
         */
        getTotal: () => clientsData.length,

        /**
         * Devuelve la lista completa de clientes
         */
        getAll: () => [...clientsData],

        /**
         * Una manera de buscar 1 cliente por uno de sus atributos exactos
         */
        client: (value, key = 'id') => clientsData.find((item) => {
            item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
            return item[key] === value;
        }),

        /**
         * Crea cliente apartir del objeto enviado
         */
        create: (fields = {}) => {
            if (typeof fields !== 'object') return false;

            // Se agrega el esquema al objeto
            fields = Object.assign({...schema}, fields);
            
            // Se agrega el nuevo objeto al almacenamiento
            const newData = [...clientsData, fields];
            setValue(JSON.stringify(newData));
            
            return true;
        },
        
        /**
         * Una manera de borrar 1 cliente por uno de sus atributos exactos
         */
        delete: (value, key = 'id') => {
            setValue(
                JSON.stringify(
                    clientsData.filter((item) => {
                        item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
                        return item[key] !== value;
                    })
                )
            );
        },

        /**
         * Crea una lista de los objetos que cumplen con la busqueda
         */
        searchList: (value, keys = ['fullname', 'contactNumber']) => {
            return clientsData.filter((item) => {
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