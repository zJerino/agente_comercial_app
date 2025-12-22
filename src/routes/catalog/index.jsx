import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import CategoriesModel from '../../models/catalog/categories';
import { getAll } from '../../models/catalog/product';
import { LoaderInContent, Spinner } from '../../components/Loading';
import CenterInfo from '../../components/CenterInfo';

let imgDefault = 'https://placehold.co/100?text=';

/**
 * Pagina de inicio de las ordenes
 */
let first = true;

/**
 * Limite de productos a mostrar
 */
let limit = 5;

/**
 * Categorias
 */
function Category({ item }) {
    const [ products, setProducts ] = useState(null);

    let pro = null;
    useEffect(() => {
        if (products === null) {
            let pids = Array.isArray(item.products) ? item.products : [];

            /**
             * Obtiene los resultados
             */
            // eslint-disable-next-line
            getAll((v) => pids.some((e) => e == v.id)).then((li) => {
                if (Array.isArray(li)) return setProducts(li.slice(0, limit));
                setProducts([]);
            }).catch(() => setProducts([]));
        }
    // eslint-disable-next-line
    }, [item.id]);
    

    if (products !== null && products.length === 0) {
        pro = (
            <Link to={"/catalog/category/"+item.id+"/add"} className="flex flex-col rounded-[0.85rem] overflow-hidden relative border-[1px] hover:border-dashed h-[7rem] w-full items-center justify-center mx-2 hover:border-primary transition-colors duration-[.30s]">
                <i className="bi bi-plus text-stone-300 text-[1.25rem]"></i>
                <span className="font-[600] px-2 text-black transition-all duration-[.25s]">
                    Categoria sin productos
                </span>
                <span className="font-[200] text-[.85rem] px-2 text-stone-300 transition-all duration-[.25s]">
                    Click para agregar alguno
                </span>
            </Link>
        );
    } else if (Array.isArray(products)) {
        pro = products.map((it, key) => {
            if (Array.isArray(it.images[0]) && typeof it.images[0][1] === 'object' && it.images[0][1].constructor.name === 'ArrayBuffer') {
                it.images[0] = URL.createObjectURL(new Blob([it.images[0][1]], {type: it.images[0][0]}));
            }
            return (
                <Link to={"/catalog/product/" + it.id} key={key} className="flex flex-col rounded-[0.85rem] overflow-hidden relative border-[1px] size-[7rem] min-w-[7rem]">
                    <img src={typeof it.images[0] === 'string' ? it.images[0] : imgDefault + 'S'} alt="A epic foto from product #id" className="block size-full" />
                    <span className="font-[600] w-full absolute bottom-[-0.75rem] hover:bottom-[-0.5rem] pb-[1rem] px-2 bg-gradient-to-t from-black/60 hover:from-black/80 text-white transition-all duration-[.25s] items-end flex h-full" style={{ textShadow: '0 1px 2px black' }}>{it.name}</span>
                </Link>
            );
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-3 px-2  items-center justify-between">
                <span className="font-[600]">{item.name}</span>
                <Link to={'/catalog/category/' + item.id} className="btn btn-sm bg-blue-200 hover:bg-blue-300">
                    Ver mas
                </Link>
            </div>
            <div className={"flex gap-2 relative" + (pro === null ? '': ' overflow-x-auto')}>
                {pro === null ? <Spinner className="mx-auto size-[2rem]" /> : pro}
            </div>
            
            <Link to='/catalog/new' className="fixed bg-primary bottom-[5rem] flex items-center justify-center right-[2rem] rounded-full size-[3rem] text-[1.5rem] text-white">
                <i className="bi bi-plus"></i>
            </Link>
        </div>
    );
}

export default function Main() {
    const { searchVal, setTitle } = useOutletContext();
    const model = CategoriesModel();
    let listFn = model.list;
    let listData = model.data;
    let listLoading = !model.loaded;
    
    // Titulo del Topbar
    useEffect(() => {
        setTitle('Tu catalogo');
    }, [setTitle]);

    // Ejecuta el efecto cada vez que searchVal cambie
    useEffect(() => {
        if (!first && listLoading) return;

        if (String(searchVal).trim().length > 0){
            listFn((item) => String(item.name).toLowerCase().includes(String(searchVal).toLowerCase()));
        } else {
            listFn(() => true);
        }
    // eslint-disable-next-line
    }, [searchVal]);

    let List = useMemo(() => {
        if (!Array.isArray(listData)) return [];

        return listData.map((item, i) => (<Category key={item.id} item={item} />));
    }, [listData]);

    // Estado de carga
    if (listLoading) return (<LoaderInContent />)

    // Lista vacia
    if (Array.isArray(List) && List.length === 0) {
        // Busqueda
        if (searchVal !== null && String(searchVal).trim().length > 0) {
            return <CenterInfo icon="search" text="No se han encontrado resultado" />
        } else {
            return <CenterInfo 
                icon="bi-balloon text-black-400"
                text="Catalogo vacio"
                sub="Todavia no has agregado ninguna categoria o productos"
                classes={{
                    icon: 'text-[4rem] flex justify-center items-center',
                    text: 'text-black font-[600]',
                }}
                btns={[
                    {
                        text: 'Crear una categoria',
                        icon: 'card-list',
                        link: '/catalog/category/new',
                    },
                    {
                        text: 'Crear un producto',
                        icon: 'box',
                        link: '/catalog/product/new',
                        bg: 'bg-stone-200',
                    }
                ]}
            />;
        }
    } else {
        return (
            <div className="flex flex-col gap-4 my-4">
                <div className="flex flex-col gap-2">
                    {List}
                </div>
            </div>
        );
    }
}
