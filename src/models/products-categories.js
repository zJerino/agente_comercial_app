import { useLocalStorage } from "react-use";
import { schema, dbName as categoryDB } from '../configs/productCategory';
import { tryParseJSON } from '../configs/utils';

export const CategoryModel = () => {
    /**
     * Datos
     */
    const [ raw, setValue ] = useLocalStorage(categoryDB, "[]");
    const data = tryParseJSON(raw) || [];
    const categoryData = Array.isArray(data) ? data : [];

    return {
        /**
         * Devuelve el total de objetos en la db
         */
        getTotal: () => categoryData.length,
        
        /**
         * Devuelve todos los objetos
         */
        getAll: () => [...categoryData],

        /**
         * Una manera de buscar 1 producto por uno de sus atributos exactos
         */
        category: (value, key = 'id') => categoryData.find((item) => {
            item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
            return item[key] === value;
        }),

        /**
         * Agrega un producto
         */
        addProduct: (categoryId, productId) => {
            let i = -1;
            let c = categoryData.find((item, index) => {
                item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
                if (item['id'] === categoryId) {
                    i = index;
                    return true;
                }
                return false;
            });

            /**
             * Si no existe la categoria
             */
            if (c === undefined) return false;
            
            /**
             * Previene incluirlo si ya existe
             */
            if (!c.products.includes(c)) {
                c.products.push(productId);
                categoryData[i] = c;
                setValue(JSON.stringify(categoryData));
                return true;
            }
            return false;
        },

        /**
         * remueve un producto
         */
        removeProduct: (categoryId, productId) => {
            let i = -1;
            let c = categoryData.find((item, index) => {
                item = Object.assign({ ...schema }, item); // Se asegura que el objeto cumple con el esquema
                if (item['id'] === categoryId) {
                    i = index;
                    return true;
                }
                return false;
            });

            /**
             * Si no existe la categoria
             */
            if (c === undefined) return false;
            
            /**
             * Previene incluirlo si ya existe
             */
            if (!c.products.includes(c)) {
                c.products = c.products.filter((e) => (productId !== e));
                
                categoryData[i] = c;
                setValue(JSON.stringify(categoryData));
                return true;
            }
            return false;
        },

        /**
         * Crea objetos
         */
        create: (fields = {}) => {
            if (typeof fields !== 'object') return false;

            // Se agrega el esquema al objeto
            fields = Object.assign({...schema}, fields, {createdAt: (new Date()).getTime()});
            
            // Se agrega el nuevo objeto al almacenamiento
            const newData = [...categoryData, fields];
            setValue(JSON.stringify(newData));
            
            return true;
        },
        
        /**
         * Una manera de borrar 1 producto por uno de sus atributos exactos
         */
        delete: (value, key = 'id') => {
            setValue(
                JSON.stringify(
                    categoryData.filter((item) => {
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
            return categoryData.filter((item) => {
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