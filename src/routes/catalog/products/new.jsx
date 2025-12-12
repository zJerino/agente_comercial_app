import { useState } from 'react';
import { useNavigate } from 'react-router';
import { schema as productSchema } from '../../../configs/products';
import { ProductsModel } from '../../../models/products';
import Camera from '../../../components/Base64Camera';


const ProductImageItem = ({ img, imageDeleteHandler, k }) => {
    // Estado local para controlar la visibilidad del overlay de "Doble click para eliminar"
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    // Estado para guardar el ID del timeout y poder cancelarlo
    const [clickTimeoutId, setClickTimeoutId] = useState(null);

    /**
     * Maneja el click simple (mostrar overlay) y el doble click (eliminar imagen)
     */
    const handleClick = (event) => {
        // Limpiar cualquier timeout existente para resetear el comportamiento
        if (clickTimeoutId) {
            clearTimeout(clickTimeoutId);
            setClickTimeoutId(null);
        }

        // event.detail es 2 en doble click
        if (event.detail === 2) {
            // Código de eliminación: llama a la función de borrado pasada por prop
            imageDeleteHandler();
            setShowDeleteOverlay(false); // Asegurar que el overlay se oculte
        } 
        // event.detail es 1 en un solo click
        else if (event.detail === 1) {
            // Mostrar mensaje de doble click para eliminar
            setShowDeleteOverlay(true);

            // Ocultar el mensaje automáticamente después de 2 segundos
            const timerId = setTimeout(() => {
                setShowDeleteOverlay(false);
                setClickTimeoutId(null);
            }, 2000);
            setClickTimeoutId(timerId);
        }
    };

    // Clases para la superposición. 'pointer-events-none' previene que el div invisible bloquee el doble click.
    const overlayClasses = showDeleteOverlay
        ? 'opacity-100'
        : 'opacity-0 pointer-events-none';

    return (
        <div
            // Se mantiene el estilo original
            className="min-w-[10rem] size-[10rem] border-[1px] inline-block relative overflow-hidden rounded-md cursor-pointer group"
            onClick={handleClick}
            key={k}
        >
            <div className="flex items-center justify-center p-2 h-full">
                {/* Usamos object-cover para que las imágenes llenen el espacio sin distorsionarse */}
                <img
                    className="size-full object-cover rounded-sm group-hover:scale-[1.02] transition-transform"
                    src={img}
                    alt={'A image upload #' + k}
                />
            </div>

            {/* Overlay que se activa con un solo click */}
            <div className={`absolute inset-0 bg-black/75 flex flex-col gap-1 items-center justify-center text-center text-white p-2 transition-opacity duration-300 ${overlayClasses}`}>
                <i className="bi bi-trash-fill text-[2rem]"></i>
                <span className="font-semibold">Doble click para eliminar</span>
            </div>
        </div>
    );
};

export default function Main() {    
    const [value, setValue] = useState(productSchema);
    const navigate = useNavigate();
    const { create } = ProductsModel();


    /**
     * Maneja el guardado del producto (anteriormente "cliente")
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        /**
         * En caso de error no redireccionar
         */
        let ob = { ...value, id: crypto.randomUUID() };
        if (!create(ob)) {
            console.error('[ERROR] No se pudo crear el nuevo producto');
            return false;
        }

        // Navegar a la página del nuevo producto
        navigate('/catalog/product/' + ob.id);
    };

    /**
     * Maneja los cambios de los inputs y los guarda en un estado
     */
    const handleChange = (event) => {
        const { name, value: inputValue, type, checked } = event.target;

        setValue((prevProduct) => ({
            ...prevProduct,
            [name]: type === "checkbox" ? checked : inputValue
        }));
    };


    /**
     * Maneja las imagenes agregadas
     */
    const handleCamera = (image64) => {
        setValue((data) => ({
            ...data,
            images: [...data.images, image64]
        }));
    };

    /**
     * Maneja el borrado de imagenes
     * Retorna una función que se llamará al hacer doble click
     */
    const handleImageDelete = (imageData) => {
        return function () {
            setValue((data) => ({
                ...data,
                images: data.images.filter(v => (v !== imageData))
            }));
        }
    }

    /**
     * Mapeo de imagenes
     */
    const Images = value.images.map((img, key) => (
        <ProductImageItem key={key} k={key} img={img} imageDeleteHandler={handleImageDelete(img)} />
    ));

    return (
        <div className="flex flex-col my-3">
            <form className="mx-auto flex w-full max-w-md flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <label htmlFor="camIn" className=" mb-2">
                        <img className="rounded-full size-[7rem] mx-auto border-[1px]" src={value.images.length > 0 ? value.images[0] : 'https://placehold.co/100?text=New'} alt="Me at the park."/>
                    </label>
                    <h1 className="text-3xl font-semibold">Nuevo producto</h1>
                    <p className="text-sm">Agrega la informacion de tu nuevo producto</p>
                </div>
                <div className="form-group px-3 sm:px-1">
                    <div className="form-field">
                        <label className="form-label">Nombre</label>
                        <input 
                            placeholder="Nombre del producto" 
                            name="name" 
                            type="text" 
                            className="input max-w-full" 
                            value={value.name}
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Texto explicativo</label>
                        <textarea 
                            placeholder="Descripción detallada" 
                            name="description" 
                            className="textarea max-w-full" 
                            value={value.description}
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Precio</label>
                        <input 
                            placeholder="0.00" 
                            name="price" 
                            type="number" 
                            step="0.01"
                            className="input max-w-full" 
                            value={value.price}
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Fotos</label>
                        <div className="flex gap-2 overflow-x-auto px-2 pb-2">
                            {Images}
                            <Camera onCapture={handleCamera} inputId="camIn">
                                <div className={Images.length > 0 ? "border-[1px] border-dashed rounded-md text-stone-400 size-[10rem] flex items-center justify-center p-2 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer" : "border-[1px] border-dashed rounded-md h-[10rem] w-full flex flex-col items-center justify-center p-2 text-stone-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"}>
                                    <i className="bi bi-plus text-[2rem]"></i>
                                    {Images.length > 0 ? '' : <span>Agregar una foto</span>}
                                </div>
                            </Camera>
                        </div>
                    </div>
                    <div className="form-field pt-5">
                        <div className="form-control justify-between">
                            <button type="submit" className="btn btn-primary w-full">Guardar Producto</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}