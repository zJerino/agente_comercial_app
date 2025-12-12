import { useEffect, useState } from 'react';
import { useLocalStorage } from "react-use";
import { tryParseJSON } from '../configs/utils';

/**
 * API URL
 */
const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';
/**
 * Esquema de respuesta de la API
 */
const apiRespondeSchema = {
    fuente: "",
    nombre: "",
    compra: 0,
    venta: 0,
    promedio: 0.00,
    fechaActualizacion: ""
}

/**
 * Nos ayuda a saber si la fecha todavia esta bien
 */
function isUpdated(fechaTasa) {
    var now = new Date(); // Fecha de ahora
    var tasa = new Date(fechaTasa);
    var StartTasa = new Date(now); // Inicio de la tasa
    var EndTasa = new Date(now); // Cierre de la tasa

    /**
     * Establecer el rango
     */
    if (17 > now.getHours()) {
        EndTasa.setHours(17, 0, 0, 0); // Establece el fin de la tasa

        // Establece el inicio de la tasa
        StartTasa.setDate(now.getDate() - 1);
        StartTasa.setHours(17, 0, 0, 0);
    } else if (now.getHours() >= 17) {
        // Establece el inicio de la tasa
        StartTasa.setHours(17, 0, 0, 0);

        // Establece el fin de la tasa 
        EndTasa.setDate(now.getDate() + 1);
        EndTasa.setHours(17, 0, 0, 0);
    }
    return (tasa.getTime() >= StartTasa.getTime() && tasa.getTime() <= EndTasa.getTime());
}

/**
 * Modelo de controlador del dolar
 */
export default function DolarModel() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useLocalStorage('dolarbcv', {});

    let data = tryParseJSON(value) || {};
    data = Object.assign({...apiRespondeSchema}, data);

    useEffect(() => {
        const fetchData = async () => {
          try {
            let api = await fetch(API_URL);              
            
            if (!api.ok) {
              throw new Error(`HTTP error! status: ${api.status}`);
            }

            const json = await api.json();
            setValue(JSON.stringify(Object.assign({...apiRespondeSchema}, json)));
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };

        if (data.fechaActualizacion.length <= 0 || !isUpdated(data.fechaActualizacion)) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [data.fechaActualizacion, setValue]);

    return {
        /**
         * Devuelve el precio del dolar bcv
         */
        price: data.promedio,

        /**
         * Last update
         */
        lastUpdate: new Date(data.fechaActualizacion),
        
        /**
         * Devuelve si todavia se esta cargando la informacion
         */
        isLoading: loading,

        /**
         * Error
         */
        error: error,
    }
}