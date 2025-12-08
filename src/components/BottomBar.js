import { Link } from 'react-router';

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
    }
];

export default function bottomBar() {
    let links = rutas.map((item) => {
        return (
            <Link to={item.to} className="flex flex-col justify-center max-w-[3rem] w-full mx-auto text-stone-500 text-center">
                <i className={'bi bi-' + item.icon + ' text-[1.5rem]'}></i>
                <span className="text-[.85rem]">{item.text}</span>
            </Link>
        );
    });
    return (
        <div className="border-t-[1px] px-3 py-2">
            <div className="flex">
                {links}
            </div>
        </div>
    );
}
