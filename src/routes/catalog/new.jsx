import { Link } from 'react-router';


export default function Main() {

    return (
        <div className="flex flex-col justify-center align-center w-full h-full gap-3">
            <h4 className="mx-auto text-stone-900 font-[700] text-[2rem]">¿Que deseas crear?</h4>

            <div className="flex flex-col items-center gap-2 mx-auto w-[20rem] px-2">
                <Link className="btn btn-solid-primary btn-block justify-start text-start" to='/catalog/product/new'>
                    <i className="bi bi-box me-2"></i> Crear un nuevo producto
                    <i className="bi bi-chevron-right ms-auto"></i>
                    
                </Link>
                <Link className="btn btn-gray-200 btn-block justify-start text-start" to='/catalog/category/new'>
                    <i className="bi bi-collection me-2"></i> Crear una categoria
                    <i className="bi bi-chevron-right ms-auto"></i>
                </Link>
            </div>
        </div>
    );
}