import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Model, { Update } from '../../../models/catalog/category';
import { getAll } from '../../../models/catalog/product';
import { LoaderInContent } from '../../../components/Loading';

export default function Main() {
    const { id } = useParams();
    const [ category, setCategory ] = useState(null);
    const [ products, setProducts ] = useState(null);
    const [ loading, setLoading ] = useState(true); // Estado de carga. Por defecto es verdadero

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
            getAll().then((items) => {
                if (Array.isArray(items) && items.length > 0) {
                    return setProducts(items);
                }
                return setProducts([]);
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
    }
    
    /**
     * Aviso de inexistencia
     * Para mas tarde: Cambiar esto por un CenterInfo
     */
    if (category === null) {
        return (
            <div className="flex flex-col justify-center align-center w-full h-full">
                <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                <h4 className="mx-auto text-stone-400">La categoria que buscas no existe.</h4>
            </div>
        );
    }

    /**
     * Handle Add
     */
    function handleClick(event) {
        const { name, checked } = event.target;

        let addp = [...category.products, (!isNaN(Number(name)) ? Number(name) : name)];
        // eslint-disable-next-line 
        let delp = (category.products.filter((oit) => oit != name));

        if (checked) return Update(Number(id), {
            products: addp
        }).then(() => {
            category.products = addp;
            if (event.target.checked) event.target.checked = false;
        });
        
        return Update(Number(id), {
            products: delp
        }).then(() => {
            category.products = delp;            
            if (!event.target.checked) {
                event.target.checked = true;
            }
        });
    }
    
    /**
     * Pantalla de carga
     */
    if (products === null) {
        return (
            <LoaderInContent sub="Cargando productos" />
        );
    }

    let productList = [];

    productList.push(
        <Link key='create-new' className="p-2 flex items-center gap-2 h-[4.1rem]" to='/catalog/product/new'>
            <i className="bi bi-plus-circle-fill text-stone-300 size-[3rem] text-[2rem] me-2 flex items-center justify-center"></i>
            <span>Crear un nuevo producto</span>
        </Link>
    );

    productList = [
        ...productList,
        ...products.map((item, key) => {
            let checkIn = <input type="checkbox" className="checkbox ms-auto" name={item.id} id={'product-' + key} onChange={handleClick} />;
    
            // eslint-disable-next-line 
            if (category.products.some((el) => el == item.id)) {
                checkIn = <input type="checkbox" className="checkbox ms-auto" name={item.id} id={'product-' + key} onChange={handleClick} checked/>
            }

            if (Array.isArray(item.images[0]) && typeof item.images[0][1] === 'object' && item.images[0][1].constructor.name === 'ArrayBuffer') {
                item.images[0] = URL.createObjectURL(new Blob([item.images[0][1]], {type: item.images[0][0]}));
            }
    
            return (
                <label key={key} htmlFor={'product-' + key} className="p-2 flex items-center gap-2 h-[4.1rem]">
                    <img src={item.images.length > 0 ? item.images[0] : 'https://placehold.co/100?text=No+Image'} className="rounded-full me-2 size-[3rem]" alt="Me at the park." />
                    <span>{item.name}</span>
                    {checkIn}
                </label>
            );
        })
    ];

    return (
        <div className="flex flex-col">
            {productList}
        </div>
    );
}