/**
 * Un componente de busqueda creado para el topbar
 */
export default function Main({ text = 'Ingresa lo que quieras buscar', onClose = null, onUpdate = null}) {
    function handleChange(v) {
        if (typeof onUpdate == 'function') return onUpdate(v.target.value);
    }

    function handleClose(v) {
        if (typeof onClose == 'function') return onClose(true);
    }

    return (
        <div className="form-group">
            <div className="form-control relative w-full">
                <input type="text" className="input input-lg input-solid max-w-full pl-10" placeholder={text} onChange={handleChange} />

                <span className="absolute inset-y-0 left-1 inline-flex items-center">
                    <i className="bi bi-arrow-left flex items-center justify-center p-3 text-[1rem]" onClick={handleClose}></i>
                </span>
            </div>
        </div>
    );
}