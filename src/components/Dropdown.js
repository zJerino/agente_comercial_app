import { Link } from 'react-router';

/**
 * Esquema de items del dropdown
 */
export const itemsScheme = {
    icon: '',
    text: '',
    link: '',
    modal: '',
};

export default function Dropdown({ items = [], title = <i className="bi bi-three-dots"></i>, btnclass = 'btn btn-solid-primary my-2', className = ""}) {
    items = items.map((item, index) => {
        if (typeof item == 'object') {
            item = Object.assign({...itemsScheme}, item);
            if (item.modal.length > 0) {
                return (
                    <label key={index} className="dropdown-item text-sm flex-row gap-1" htmlFor={item.modal}>
                        {item.icon.length > 0 ? <i className={'bi bi-' + item.icon}></i> : ''} <span>{item.text}</span>
                    </label>
                );
            } else {
                return (
                    <Link key={index} className="dropdown-item text-sm flex-row gap-1">
                        {item.icon.length > 0 ? <i className={'bi bi-' + item.icon}></i> : ''} <span>{item.text}</span>
                    </Link>
                );
            }
        } else {
            return null
        }
    }).filter((item) => typeof item == 'object');

    return (
        <div className={ "dropdown " + className }>
            <label className={btnclass} tabIndex="0">{title}</label>
            <div className="dropdown-menu">
                {items}
            </div>
        </div>
    );
}