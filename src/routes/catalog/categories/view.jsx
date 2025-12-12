import { useState } from 'react';
import { useNavigate, useParams, Link, useOutletContext } from 'react-router';
import { CategoryModel } from '../../../models/products-categories';
import { ProductsModel } from '../../../models/products';
import Carousel from '../../../components/Carousel';

export default function Main() {
    const { id } = useParams();
    const [ isDelete, setDelete ] = useState(false);
    const { setTitle } = useOutletContext();

    const navigate = useNavigate();
    const model = CategoryModel();
    const pModel = ProductsModel();
    const category = model.category(id);
    
    /**
     * Aviso de inexistencia
     */
    if (category === undefined) {
        if (isDelete) return navigate('/catalog'); // Si el catalogo fue borrado.

        return (
            <div className="flex flex-col justify-center align-center w-full h-full">
                <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                <h4 className="mx-auto text-stone-400">La categoria que buscas no existe.</h4>
            </div>
        );
    }
    
    // Titulo del Topbar
    setTitle(category.name);

    /**
    * Funcion para borrar categorias
    */
    const handleDelete = function () {
        model.delete(id);
        setDelete(true);
    };

    /**
     * Modal para eliminar la categoria
     */
    const deleteModal = (
        <>
            <input className="modal-state" id="modal-delete" type="checkbox" />
            <div className="modal">
                <label className="modal-overlay" htmlFor="modal-delete"></label>
                <div className="modal-content flex flex-col gap-5">
                    <label htmlFor="modal-delete" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl">¿Seguro de continuar?</h2>
                    <span>Confirma que estas seguro de de borrar esta categoria (Esto no eliminara los productos de la lista)</span>
                    <div className="flex flex-col gap-3">
                        <button className="btn btn-error btn-block" onClick={handleDelete}>Confirmar</button>
                        <label className="btn btn-block" htmlFor="modal-delete">Cancelar</label>
                    </div>
                </div>
            </div>
        </>
    );

    if (category.products.length === 0) {
        return (
            <div className="flex flex-col justify-center align-center w-full h-full gap-3">
                <h4 className="mx-auto text-stone-900 font-[700] text-[2rem]">Esta categoria se encuentra vacia</h4>

                <div className="flex flex-col items-center gap-2 mx-auto w-[20rem] px-2">
                    <Link className="btn btn-solid-primary btn-block justify-start text-start" to={'/catalog/category/' + id + '/add'}>
                        <i className="bi bi-plus-circle-fill me-2"></i> <span>Agregar productos</span> <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                    <label className="btn btn-red-200 btn-block justify-start text-start" htmlFor="modal-delete">
                        <i className="bi bi-trash-fill me-2"></i>
                        <span>Eliminar categoria</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </label>
                </div>
                {deleteModal}
            </div>
        );
    }

    /**
     * Filtrado y creacion de elementos
     */
    let products = pModel.getAll().filter((item) => category.products.includes(item.id)).map((item, key) => {
        return (
            <Link className="flex flex-col p-1 border-[1px] rounded-[.5rem] gap-2" key={key} to={"/catalog/product/" + item.id}>
                <Carousel 
                    items={item.images.length === 0 ? ['https://placehold.co/100?text=No+Image'] : item.images}
                    autoSlide={true}
                    autoSlideInterval={5000}
                    customClasses={{
                        container: 'rounded-[.4rem]',
                        slide: 'h-64 sm:h-80 md:h-[500px]', // Altura responsiva
                        text: 'font-serif tracking-wider', // Tipografía personalizada para el texto
                    }}
                />

                <span className="px-2 w-100 text-center">{item.name}</span>
            </Link>
        );
    });

    return (
        <>
            <div className="flex flex-col gap-3 p-2">
                {products}
            </div>
            {deleteModal}
        </>
    );
}