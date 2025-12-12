import { useState } from 'react';
import { useNavigate } from 'react-router';
import { schema as categorySchema } from '../../../configs/productCategory';
import { CategoryModel } from '../../../models/products-categories';

export default function Main() {
    const [value, setValue] = useState(categorySchema);
    const navigate = useNavigate();
    const { create } = CategoryModel();

    /**
     * Maneja el guardado del cliente en localStorage
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        /**
         * En caso de error no redireccionar
         */
        let ob = {...value, id: crypto.randomUUID()};
        if (!create(ob)) {
            console.error('[ERROR] No se pudo crear el nuevo cliente');
            return false;
        }

        navigate('/catalog/category/' + ob.id);
    };
    
    /**
     * Maneja los cambios de los inputs y los guarda en un estado
     */
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setValue((prevClient) => ({
            ...prevClient,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className="flex flex-col min-h-full justify-center py-5">
            <form className="mx-auto flex w-full max-w-md flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-semibold">Nueva categoria</h1>
                    <p className="text-sm">Agrega la informacion de tu nueva categoria</p>
                </div>
                <div className="form-group px-3 sm:px-1">
                    <div className="form-field">
                        <label className="form-label">Nombre</label>
                        <input placeholder="Type here" name="name" type="text" className="input max-w-full" onChange={handleChange}/>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Texto explicativo</label>
                        <input placeholder="Type here" name="description" type="text" className="input max-w-full" onChange={handleChange}/>
                    </div>
                    <div className="form-field pt-5">
                        <div className="form-control justify-between">
                            <button type="submit" className="btn btn-primary w-full">Guardar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}