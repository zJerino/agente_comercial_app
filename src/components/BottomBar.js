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
    // let activeClass = 'bg-primary/10 text-primary';
    let links = rutas.map((item, i) => {
        return (
            <Link to={item.to} key={i} className="flex flex-col justify-center max-w-[5rem] mx-auto p-1 rounded-full text-center text-stone-500 w-full">
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
