import { NavLink } from 'react-router';
import { useMemo } from 'react';

const rutas = [
    {
        'text': 'Home',
        'icon': 'house',
        'to': '/'
    },
    {
        'text': 'Clients',
        'icon': 'person',
        'to': '/clients'
    },
    {
        'text': 'Orders',
        'icon': 'card-list',
        'to': '/orders'
    },
    {
        'text': 'Catalog',
        'icon': 'boxes',
        'to': '/catalog'
    }
];

export default function BottomBar({ restSearch }) {
    const classes = " flex flex-col justify-center max-w-[7rem] mx-auto p-1 rounded-full text-center w-full transition-colors duration-[.4s]";
    const activeClass = 'bg-primary/10 text-primary';

    const links = useMemo(() => {
        let r = (typeof restSearch === 'function') ? restSearch() : (() => {});

        return rutas.map((item, i) => (
            <NavLink to={item.to}  key={i} onClick={r}
                className={({ isActive }) => (isActive ? activeClass : 'text-stone-500 hover:bg-gray-100 bg-transparent') + classes } 
            >
                <i className={'bi bi-' + item.icon + ' text-[1.5rem]'}></i>
                <span className="text-[.85rem]">{item.text}</span>
            </NavLink>
        ));
    }, [restSearch]);

    return (
        <div className="border-t-[1px] px-3 py-1">
            <div className="flex">
                {links}
            </div>
        </div>
    );
}
