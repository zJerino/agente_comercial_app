/**
 * Modelo para manejar una sola categoria (Prototipo)
 */
import { DBInstance as DB } from '../../classes/database';
import { schema, dbName } from '../../configs/catalog_categories';

/**
 * Esquema de los datos
 */
export const CategorySchema = {
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
            let ob = await DB.get(dbName, (!isNaN(Number(id)) ? Number(id) : id));
            if (typeof ob === 'object') {
                /**
                 * Formato
                 */
                ob = Object.assign({...CategorySchema}, ob);

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
    return DB.update(dbName, {...fields, id: (!isNaN(Number(id)) ? Number(id) : id)});
}

/**
 * Remove un objeto
 */
export function Remove(id) {
    return DB.remove(dbName, (!isNaN(Number(id)) ? Number(id) : id));
}