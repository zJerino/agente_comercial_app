import { useCopyToClipboard } from 'react-use';
import DolarModel from '../models/dolar';

/**
 * Esto es un componente que indica el precio del dolar (Venezuela)
 */
export default function Main() {
    const { price, isLoading, lastUpdate, error } = DolarModel();
    // eslint-disable-next-line
    const [state, copyToClipboard] = useCopyToClipboard();

    let status;

    /**
     * Si no existe fecha
     */
    if (!isLoading && lastUpdate) {
        status = `Ultima actualizacion: ${lastUpdate.toLocaleDateString()} ${lastUpdate.getHours()}:${lastUpdate.getMinutes()}`;
    }

    if (error) {
        return;
    }

    if (isLoading) {
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
                <h3 className="text-[1.25rem] font-[500]"><span onClick={() => copyToClipboard(price)}>{price}</span> Bs</h3>
                <h5 className="text-[0.9rem] font-[200]">{status}</h5>
            </div>
        </div>
    );
}