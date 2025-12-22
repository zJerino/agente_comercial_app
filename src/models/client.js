/**
 * Modelo para manejar un solo cliente (Prototipo)
 */
import { DBInstance as DB } from '../classes/database';
import { schema, dbName } from '../configs/clients';

/**
 * Esquema de los datos
 */
export const ClientSchema = {
    businessImg: '',
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
            let ob = await DB.get(dbName, Number(id));
            if (typeof ob === 'object') {
                /**
                 * Formato
                 */
                ob = Object.assign({...ClientSchema}, ob);

                /**
                 * Set image to blob
                 */
                if (Array.isArray(ob.businessImg) && ob.businessImg.length === 2 && typeof ob.businessImg[0] === 'object' && ob.businessImg[1].constructor.name === 'ArrayBuffer') {
                    let newBlob = new Blob([ob.businessImg[1]], {type: ob.businessImg[0]});
                    ob.businessImg = URL.createObjectURL(newBlob);
                }

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