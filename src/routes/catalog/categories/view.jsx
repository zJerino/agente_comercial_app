import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useOutletContext } from 'react-router';
import Carousel from '../../../components/Carousel';

import Model, { Remove } from '../../../models/catalog/category';
import { getAll } from '../../../models/catalog/product';
import { LoaderInContent } from '../../../components/Loading';

export default function Main() {
    const { id } = useParams();
    const [ isDelete, setDelete ] = useState(false);
    const { setTitle } = useOutletContext();
    const [ category, setCategory ] = useState(null);
    const [ products, setProducts ] = useState(null);
    const [ loading, setLoading ] = useState(true); // Estado de carga. Por defecto es verdadero
    
    const navigate = useNavigate();

    /**
     * Obtener Categoria
     */
    useEffect(() => {
        let model = Model(id);
        model.promise.then((c) => {
            setCategory(c);
            
            /**
             * Busqueda de los productos
             */
            // eslint-disable-next-line
            getAll((p) => c.products.some((e) => e == p.id)).then((li) => {
                if (Array.isArray(li)) return setProducts(li);
                setProducts([]);
            }).catch(() => setProducts([]));

            setLoading(false); // Estado de carga
        }).catch(() => {
            setLoading(false);
        });
    }, [id]);

    /**
     * Pantalla de carga
     */
    if (loading) {
        return (
            <LoaderInContent sub="Cargando categoria" />
        );
    } else if (isDelete) {
        return (
            <div className="flex flex-col justify-center align-center w-full h-full">
                <i className="bi bi-x-circle text-[4rem] mx-auto mb-3 text-stone-300"></i>
                <h4 className="mx-auto text-stone-400">La categoria fue borrada.</h4>
            </div>
        );
    } else if (category === null) {
        return (
            <div className="flex flex-col justify-center align-center w-full h-full">
                <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                <h4 className="mx-auto text-stone-400">La categoria que buscas no existe.</h4>
            </div>
        );
    } else if (products === null) {
        return (
            <LoaderInContent sub="Cargando productos" />
        );
    }

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
        console.log('Borrando, ', id)        
        Remove(id).then(() => {
            console.log('Borrado ', id)            
            setDelete(true);
        }).catch(() => {
            // Error
        });
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
    let pro = products.map((item, key) => {
        /**
         * Procesado de imagenes
         */
        item.images = item.images.map((el) => {
            let val = el;
            if (Array.isArray(val) && typeof val[1] === 'object' && val[1].constructor.name === 'ArrayBuffer') {
                val = URL.createObjectURL(new Blob([val[1]], {type: val[0]}));
            }
            return val;
        });

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
                {pro}
            </div>
            {deleteModal}
        </>
    );
}