import { Link, useOutletContext } from 'react-router';
import { schema as productSchema } from '../../configs/products';
import { schema as categorySchema } from '../../configs/productCategory';
import { ProductsModel } from '../../models/products';
import { CategoryModel } from '../../models/products-categories';

let imgDefault = 'https://placehold.co/100?text=';

/**
 * Pagina de inicio de las ordenes
 */
export default function Main() {
    const { searchVal, restSearch } = useOutletContext();
    const cModel = CategoryModel();
    const pModel = ProductsModel();
    let products = pModel.getAll();
    let categories = cModel.getAll();

    /**
     * En caso de busqueda
     */
    if (searchVal && String(searchVal).trim().length > 0) {

        let se = String(searchVal).trim().toLowerCase();

        let clist = categories.filter(item => item.name.toLowerCase().includes(se)).map((item, i) => {
            item = Object.assign({ ...categorySchema }, item);

            return (
                <Link to={'/catalog/category/' + item.id} key={i} className="flex p-3 border-b-[1px] items-center " onClick={() => restSearch()}>
                    <div className="flex flex-col">
                        <span className="text-black-900">
                            {item.name}
                        </span>
                    </div>
                </Link>
            );
        });

        let plist = products.filter(item => item.name.toLowerCase().includes(se)).map((item, i) => {
            item = Object.assign({ ...productSchema }, item);

            return (
                <Link to={'/catalog/product/' + item.id} key={i} className="flex p-3 border-b-[1px] items-center " onClick={() => restSearch()}>
                    <img src={item.images.length > 0 ? item.images[0] : imgDefault + item.name.substr(0, 2)} className="rounded-full me-2 size-[3rem]"  alt="Me at the park."/>
                    <div className="flex flex-col">
                        <span className="text-black-900">
                            {item.name}
                        </span>
                    </div>
                </Link>
            );
        });

        if (clist.length === 0 && plist.length === 0){
            return (
                <div className="flex flex-col justify-center align-center w-full h-full">
                    <i className="bi bi-search text-[4rem] mx-auto mb-3 text-stone-300"></i>
                    <h4 className="mx-auto text-stone-400">No se han encontrado resultados</h4>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {clist.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        <div className="font-[700] fv-small w-full flex gap-2 h-[2.1rem] flex items-center text-primary px-2">
                            <span>Categorias</span>
                        </div>
                        <div className="flex flex-col h-full">
                            {clist}
                        </div>
                    </div>
                ) : ''}
                {plist.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        <div className="font-[700] fv-small w-full flex gap-2 h-[2.1rem] flex items-center text-primary px-2">
                            <span>Productos</span>
                        </div>
                        <div className="flex flex-col h-full">
                            {plist}
                        </div>
                    </div>
                ) : ''}
            </div>
        );
    }

    /**
     * Maximo de elemento por seccion
     */
    let limit = 5;

    /**
     * Ultimos productos agregados
     */
    let lastProducts = products.reverse().slice(0, limit).map((item, key) => {
        item = Object.assign({ ...productSchema }, item);
        return (
            <Link to={'/catalog/product/' + item.id} key={key} className="flex flex-col min-h-[8rem] min-w-[8rem] rounded-[.5rem] border-[1px] max-w-[8rem]">
                <img className=" max-h-[9rem] w-[9rem] mx-auto rounded-t-[.4rem]" src={item.images.length > 0 ? item.images[0] : (imgDefault + (item.name.length > 0 ? item.name.charAt(0) : 'No+Image'))} alt={'Imagen of product #' + item.id} />
                <span className="font-[700] fv-small max-w-[9rem] my-auto p-2 text-break text-center">{item.name.trim().slice(0, 20) + (item.name.length > 20 ? '...' : '')}</span>
            </Link>
        )
    });
    lastProducts.push(
        <Link to={'/catalog/product/new'} key={lastProducts.length} className="flex flex-col min-h-[8rem] min-w-[8rem] rounded-[.5rem] max-w-[8rem] bg-gray-100 text-stone-400">
            <i className="bi bi-plus-circle-fill mx-auto text-[5rem] text-center w-[6rem] my-auto"></i>
            {/* <span className="font-[700] fv-small max-w-[9rem] my-auto p-2 text-break text-center">Agregar un producto</span> */}
        </Link>
    );


    let categoriesList = categories.map((item, key) => {
        let cProducts = products.reverse().filter((pro) => item.products.includes(pro.id)).slice(0, limit).map((pro, proKey) => {
            return (
                <Link to={'/catalog/product/' + pro.id} key={proKey} className="flex flex-col min-h-[8rem] min-w-[8rem] rounded-[.5rem] border-[1px] max-w-[8rem]">
                    <img className=" max-h-[9rem] w-[9rem] mx-auto rounded-t-[.4rem]" src={pro.images.length > 0 ? pro.images[0] : (imgDefault + (pro.name.length > 0 ? pro.name.charAt(0) : 'No+Image'))} alt={'Imagen of product #' + pro.id} />
                    <span className="font-[700] fv-small max-w-[9rem] my-auto p-2 text-break text-center">{pro.name.trim().slice(0, 20) + (pro.name.length > 20 ? '...' : '')}</span>
                </Link>
            );
        });

        cProducts.push(
            <Link to={'/catalog/category/' + item.id + '/add'} key={cProducts.length} className="flex flex-col min-h-[8rem] min-w-[8rem] rounded-[.5rem] max-w-[8rem] bg-gray-100 text-stone-400">
                <i className="bi bi-plus-circle-fill mx-auto text-[5rem] text-center w-[6rem] my-auto"></i>
                {/* <span className="font-[700] fv-small max-w-[9rem] my-auto p-2 text-break text-center">Agregar un producto</span> */}
            </Link>
        );

        return (
            <div className="flex flex-col gap-2">
                <Link key={key} className="font-[700] fv-small w-full flex gap-2 h-[2.1rem] flex items-center" to={'/catalog/category/' + item.id}>
                    <span>{item.name}</span>
                    <i className="bi bi-chevron-right ms-auto"></i>
                </Link>
                <div className="flex overflow-x-auto gap-3">
                    {cProducts}
                </div>
            </div>
        )
    });

    return (
        <div className="flex flex-col gap-3 px-2 my-5">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <div className="font-[700] fv-small w-full flex gap-2 h-[2.1rem] flex items-center">
                        <span>Ultimos productos agregados </span>
                        <Link to='/catalog/products' className="btn btn-solid-primary btn-sm ms-auto">Ver todos</Link>
                    </div>
                    <div className="flex overflow-x-auto gap-3">
                        {lastProducts}
                    </div>
                </div>
                {categoriesList}
            </div>

            <Link to='/catalog/new' className="fixed bg-primary bottom-[5rem] flex items-center justify-center right-[2rem] rounded-full size-[3rem] text-[1.5rem] text-white">
                <i className="bi bi-plus"></i>
            </Link>
        </div>
    );
}