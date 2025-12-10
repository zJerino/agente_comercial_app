import { useEffect, useState } from 'react';
import { useLocalStorage, useCopyToClipboard } from 'react-use';
import { tryParseJSON } from '../configs/utils';

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
 * Esto es un componente que indica el precio del dolar (Venezuela)
 */
export default function Main() {
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    // eslint-disable-next-line
    const [state, copyToClipboard] = useCopyToClipboard();
    const [value, setValue] = useLocalStorage('dolarbcv', {});

    let data = tryParseJSON(value) || {};
    data = Object.assign({...apiRespondeSchema}, data);

    let status;

    useEffect(() => {
        const fetchData = async () => {
          try {
            let api = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');              
            
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

    /**
     * Si no existe fecha
     */
    if (data.fechaActualizacion.length > 0) {
        const lastupdate = new Date(data.fechaActualizacion);
        status = `Ultima actualizacion: ${lastupdate.toLocaleDateString()} ${lastupdate.getHours()}:${lastupdate.getMinutes()}`;
    }
    
    if (loading) {
        return (
            <div className="bg-green-600 rounded-[1rem] px-4 py-3 text-white flex items-center gap-5">
                <i className="bi bi-currency-dollar text-[2.5rem]"></i>
                <div className="flex flex-col grow-[1]">
                    <div className="flex flex-row">
                        <span className="font-[700] fv-small">Dolar BCV</span>
                        <a className="ms-auto" href="https://www.bcv.org.ve/#:~:text=USD" rel="noreferrer" target="_blank"><i className="bi bi-box-arrow-up-right px-2 text-white text-decoration-none"></i></a>
                    </div>
                    <h3 className="text-[1.25rem] font-[500]"><span className="flex skeleton-pulse w-full min-h-[1.35rem] my-auto"></span></h3>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-green-600 rounded-[1rem] px-4 py-3 text-white flex items-center gap-5">
            <i className="bi bi-currency-dollar text-[2.5rem]"></i>
            <div className="flex flex-col grow-[1]">
                <div className="flex flex-row leading-[.85rem]">
                    <span className="font-[700] fv-small">Dolar BCV</span>
                    {/* Pronto: agregar aqui un enlace para abrir una calculadora con el precio del dolar <i className="ms-auto bi bi-calculator-fill px-2"></i> */}
                    <a className="ms-auto" href="https://www.bcv.org.ve/#:~:text=USD" rel="noreferrer" target="_blank"><i className="bi bi-box-arrow-up-right px-2 text-white text-decoration-none"></i></a>
                </div>
                <h3 className="text-[1.25rem] font-[500]"><span onClick={() => copyToClipboard(data.promedio)}>{data.promedio}</span> Bs</h3>
                <h5 className="text-[0.9rem] font-[200]">{status}</h5>
            </div>
        </div>
    );
}