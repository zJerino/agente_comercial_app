import { NavLink } from 'react-router';

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

export default function bottomBar({ restSearch }) {
    let classes = "flex flex-col justify-center max-w-[7rem] mx-auto p-1 rounded-full text-center w-full";
    let activeClass = ' bg-primary/10 text-primary';
    let links = rutas.map((item, i) => {
        return (
            <NavLink to={item.to} key={i} className={({ isActive }) => isActive ? classes + activeClass : 'text-stone-500 ' + classes } onClick={() => restSearch()}>
                <i className={'bi bi-' + item.icon + ' text-[1.5rem]'}></i>
                <span className="text-[.85rem]">{item.text}</span>
            </NavLink>
        );
    });
    return (
        <div className="border-t-[1px] px-3 py-1">
            <div className="flex">
                {links}
            </div>
        </div>
    );
}
