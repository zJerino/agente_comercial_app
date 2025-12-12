import { useParams, Link } from 'react-router';
import { CategoryModel } from '../../../models/products-categories';
import { ProductsModel } from '../../../models/products';

export default function Main() {
    const { id } = useParams();
    const model = CategoryModel();
    const pModel = ProductsModel();
    const category = model.category(id);

    /**
     * Aviso de inexistencia
     */
    if (category === undefined) {
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

        if (checked) return model.addProduct(id, name);
        return model.removeProduct(id, name);
    }

    /**
     * Obtiene los productos (En caso de ser busqueda solo los que coincidan)
     */
    const products = pModel.getAll();

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
    
            if (category.products.includes(item.id)) {
                checkIn = <input type="checkbox" className="checkbox ms-auto" name={item.id} id={'product-' + key} onChange={handleClick} checked={true} />
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