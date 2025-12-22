/**
 * Modelo para manejar un producto (Prototipo)
 */
import { DBInstance as DB } from '../../classes/database';
import { schema, dbName } from '../../configs/catalog_products';

/**
 * Esquema de los datos
 */
export const ProductSchema = {
    images: [],
    ...schema
};

/**
 * Modelo principal
 */
export default function Main(id) {
    /**
     * Salida
     */
    return {
        promise: (new Promise(async (res, rej) => {
            let ob = await DB.get(dbName, isNaN(Number(id)) ? id : Number(id));
            if (typeof ob === 'object') {
                /**
                 * Formato
                 */
                ob = Object.assign({...ProductSchema}, ob);

                /**
                 * Set image to blob
                 */
                /* if (Array.isArray(ob.images) && ob.businessImg.length === 2 && typeof ob.businessImg[0] === 'object' && ob.businessImg[1].constructor.name === 'ArrayBuffer') {
                    let newBlob = new Blob([ob.businessImg[1]], {type: ob.businessImg[0]});
                    ob.businessImg = URL.createObjectURL(newBlob);
                } */

                return res(ob);
            }

            rej(null);
        })),
    };

    /**
     * Respuesta
     */
}

/**
 * Creacion de un objeto
 */
export function Create(fields) {
    return DB.add(dbName, fields);
}

/**
 * Actualiza un objeto
 */
export function Update(id, fields) {
    return DB.update(dbName, {...fields, id: id});
}

/**
 * Borrado de un objeto
 */
export function Remove(id) {
    return DB.remove(dbName, id);
}

/**
 * Devuelve todos los elementos
 */
export function getAll(fn) {
    if (typeof fn !== 'function') fn = () => true;
    
    return (new Promise((r, re) => {
        DB.search(dbName, fn).then(res => {
            if (Array.isArray(res)) {
                return r(res.map((item) => {
                    // Procesado
                    return item;
                }));
            } else {
                r([])
            }
        }).catch(err => {
            re(err);
        });
    }));
}