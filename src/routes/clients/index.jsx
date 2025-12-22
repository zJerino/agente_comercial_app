import { useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import ClientsModel, { ClientSchema } from '../../models/clients';
import { LoaderInContent } from '../../components/Loading';
import CenterInfo from '../../components/CenterInfo';

// Un intento de estado;
let first = true;

export default function Main() {
    const { searchVal, setTitle } = useOutletContext();
    const model = ClientsModel();
    let listFn = model.list;
    let listData = model.data;
    let listLoading = !model.loaded;

    // Titulo del Topbar
    useEffect(() => {
        setTitle('Tus clientes');
    }, [setTitle]);


    // Ejecuta el efecto cada vez que searchVal cambie
    useEffect(() => {
        if (!first && listLoading) return;

        if (String(searchVal).trim().length > 0){
            listFn((item) => String(item.fullname).toLowerCase().includes(String(searchVal).toLowerCase()));
        } else {
            listFn(() => true);
        }
    // eslint-disable-next-line
    }, [searchVal]);

    let List = useMemo(() => {
        if (!Array.isArray(listData)) return [];

        return listData.map((item, i) => {
            item = Object.assign({ ...ClientSchema }, item);

            const imgUrl = item.businessImg?.length > 0 ? item.businessImg : `https://placehold.co/100?text=${item.businessName.charAt(0)}`;

            return (
                <Link to={'/clients/' + item.id + '/overview'} key={item.id} className="flex p-3 border-b-[1px] items-center transition-colors duration-[.40s] hover:bg-stone-100">
                    <img src={imgUrl} className="rounded-full me-2 size-[3rem]" alt="Me at the park." />
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
    }, [listData]);

    if (model.error) {
        return (<CenterInfo text="Ocurrio algo mientras cargabamos tus datos" sub="Intenta recargar la pagina" />)
    } else if (listLoading) {
        return (<LoaderInContent />);
    } else if (String(searchVal).length > 0 && Array.isArray(List) && List.length === 0) {
        return (
            <CenterInfo 
                icon="search"
                text="No se han encontrado resultado"
            />
        );
    } else if (Array.isArray(List) && List.length === 0) {
        return (
            <CenterInfo 
                icon="person"
                text="Sin clientes"
                sub="Tu lista de clientes esta vacia"
                btns={[
                    {
                        text: 'Crear un nuevo cliente',
                        icon: 'plus',
                        link: '/clients/new'
                    }
                ]}
            />
        );
    }

    return (
        <div className="flex flex-col h-full">
            {List}
            <Link to='/clients/new' className="absolute bg-primary bottom-[1rem] flex items-center justify-center right-[1rem] rounded-full size-[3rem] text-[1.5rem] text-white">
                <i className="bi bi-plus"></i>
            </Link>
        </div>
    );
}