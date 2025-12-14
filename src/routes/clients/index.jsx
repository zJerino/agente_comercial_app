import {useEffect} from 'react';
import { Link, useOutletContext } from 'react-router';
import { schema as clientSchema } from '../../configs/clients';
import { useClientModel } from '../../models/clients';

export default function Main() {
    const { searchVal, setTitle } = useOutletContext();
    const { searchList, getAll } = useClientModel();
    let list = [];

    // Titulo del Topbar
    useEffect(() => {
        setTitle('Tus clientes');
    }, [setTitle]);

    /**
     * Se genera la lista acorde a si se esta buscando algun cliente o se quiere ver todos
     */
    if (!searchVal || String(searchVal).trim().length === 0) {
        list = getAll();
    } else {
        list = searchList(searchVal);        
    }

    list = list.map((item, i) => {
        item = Object.assign({...clientSchema}, item);

        if (item.businessImg.length < 1) {
            item.businessImg = 'https://placehold.co/100?text=' + item.businessName.charAt(0);
        }

        return (
            <Link to={'/clients/' + item.id + '/overview'} key={i} className="flex p-3 border-b-[1px] items-center ">
                <img src={item.businessImg} className="rounded-full me-2 size-[3rem]"  alt="Me at the park."/>
                <div className="flex flex-col">
                    <span className="text-black-900">
                        {item.fullname}
                    </span>
                    <span className="text-[.8rem] text-stone-300">
                        {item.businessName}
                    </span>
                </div>
            </Link>
        );
    });

    let NoResults = (
        <div className="flex flex-col justify-center align-center w-full h-full">
            <i className="bi bi-search text-[4rem] mx-auto mb-3 text-stone-300"></i>
            <h4 className="mx-auto text-stone-400">No se han encontrado resultados</h4>
        </div>
    );

    let NoClients = (
        <div className="flex flex-col justify-center align-center w-full h-full">
            <i className="bi bi-search text-[4rem] mx-auto mb-3 text-stone-300"></i>
            <h4 className="mx-auto text-stone-400">Tu lista de clientes esta vacia</h4>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {(String(searchVal).length > 0 && list.length === 0)? NoResults : (list.length > 0 ? list : NoClients)}
            <Link to='/clients/new' className="absolute bg-primary bottom-[1rem] flex items-center justify-center right-[1rem] rounded-full size-[3rem] text-[1.5rem] text-white">
                <i className="bi bi-plus"></i>
            </Link>
        </div>
    );
}