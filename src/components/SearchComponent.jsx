import { useCallback, useState, useEffect } from 'react';

/**
 * Un componente de busqueda creado para el topbar
 */
export default function Main({ text = 'Ingresa lo que quieras buscar', onClose = null, onUpdate = null, show = true}) {
    const [val, setVal] = useState('');

    useEffect(() => {
        if (!show) setVal('');
    }, [show]);

    const handleChange = useCallback((v) => {
        setVal(v.target.value);
        if (typeof onUpdate === 'function') return onUpdate(v.target.value);
    }, [onUpdate, setVal]);

    const handleClose = useCallback(() => {
        if (typeof onUpdate === 'function') {
            onUpdate('');
        }
        if (typeof onClose === 'function') {
            onClose(true);
        }
    }, [onUpdate, onClose]);

    return (
        <div className={"form-group relative overflow-hidden transition-[.4s]" + (show ? ' h-full' : ' h-0')}>
            <div className="form-control relative w-full">
                <input type="text" className="input input-lg input-solid max-w-full pr-10" placeholder={text} onChange={handleChange} value={val}/>

                <span className="absolute inset-y-0 right-1 inline-flex items-center">
                    <i className="bi bi-x-circle-fill text-stone-400 flex items-center justify-center p-3 text-[1rem]" onClick={handleClose}></i>
                </span>
            </div>
        </div>
    );
}