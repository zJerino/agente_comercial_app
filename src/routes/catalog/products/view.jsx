import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductsModel } from '../../../models/products';
import DolarModel from '../../../models/dolar';
import Carousel from '../../../components/Carousel';
let imgDefault = 'https://placehold.co/300x100?text=';


export default function Main() {
    const { price, isLoading } = DolarModel();
    const { id } = useParams();
    const [isDeleted, setDelete] = useState(false);
    const navigate = useNavigate();
    const model = ProductsModel();

    const product = model.product(id, 'id'); // Obtiene el objeto deseado

    if (product === undefined) {
        if (isDeleted) {
            setTimeout(() => {
                navigate('/catalog');
            }, 5000);
            return (
                <div className="flex flex-col justify-center align-center w-full h-full">
                    <i className="bi bi-box-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                    <h4 className="mx-auto text-stone-400">El producto fue eliminado.</h4>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col justify-center align-center w-full h-full">
                    <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                    <h4 className="mx-auto text-stone-400">El producto que buscas no existe.</h4>
                </div>
            );
        }
    }


    /**
    * Funcion para borrar clientes
    */
    const handleDelete = function () {
        model.delete(id);
        setDelete(true);
    };

    return (
        <>
            <div className="relative">
                <div className="absolute size-full rounded-b-[2rem] z-[10]" />
                <Carousel
                    items={product.images.length === 0 ? [(imgDefault + 'No+Image')] : product.images}
                    autoSlide={true}
                    autoSlideInterval={5000}
                    customClasses={{
                        container: 'rounded-b-[2rem]',
                        slide: 'h-75 sm:h-80 md:h-[500px]', // Altura responsiva
                        text: 'font-serif tracking-wider', // Tipografía personalizada para el texto
                    }}
                />
            </div>
            <div className="flex flex-col my-3">
                <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                    <div className="flex flex-col px-2 gap-3">
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        <div className="flex flex-col">
                            <div className="flex flex-wrap">
                                <span>{product.price}</span>
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                            {!isLoading ? (
                                <div className="flex flex-wrap text-sm text-stone-400 gap-2">
                                    <span>{price * product.price}</span>
                                    <span>Bs</span>
                                </div>
                            ) : ''}
                        </div>
                        <div className="text-sm text-stone-500 bg-stone-100 rounded-[.45rem] w-full p-2 gap-2">
                            <strong className="fv-small">Description</strong>
                            <p className="text-stone-400">
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <input className="modal-state" id="modal-delete" type="checkbox" />
            <div className="modal">
                <label className="modal-overlay" htmlFor="modal-delete"></label>
                <div className="modal-content flex flex-col gap-5">
                    <label htmlFor="modal-delete" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl">¿Seguro de continuar?</h2>
                    <span>Confirma que estas seguro de de borrar este producto</span>
                    <div className="flex flex-col gap-3">
                        <button className="btn btn-error btn-block" onClick={handleDelete}>Confirmar</button>
                        <label className="btn btn-block" htmlFor="modal-delete">Cancelar</label>
                    </div>
                </div>
            </div>
        </>
    );
}