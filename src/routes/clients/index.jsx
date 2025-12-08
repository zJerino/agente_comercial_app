import { Link } from 'react-router';
import { useLocalStorage } from "react-use";

function tryParseJSON(value) {
    if (typeof value !== "string") {
      return null;
    }
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return null;
    }
  }

/**
 * Esquema de clientes
 */
let clientSchema = {
    id: '',
    fullname: '',
    contactNumber: '',
    hasWhatsapp: false,

    businessName: '',
    businessImg: '',
    businessAddress: '',
    businessGeo: '',
}

export default function Main() {
    const [value] = useLocalStorage('clients', "[]");

    const data = tryParseJSON(value) || [];

    /**
     * Genera la lista de enlaces para ver cada cliente
     */
    let list = data.map((item, i) => {
        item = Object.assign({...clientSchema}, item);

        if (item.businessImg.length < 1) {
            item.businessImg = 'https://placehold.co/100?text=' + item.businessName.charAt(0);
        }

        return (
            <Link to={'/clients/' + item.id} key={i} className="flex p-3 border-b-[1px] items-center ">
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

    return (
        <div className="flex flex-col">
            {list}
            <Link to='/clients/new' className="absolute bg-primary bottom-[1rem] flex items-center justify-center right-[1rem] rounded-full size-[3rem] text-[1.5rem] text-white">
                <i className="bi bi-plus"></i>
            </Link>
        </div>
    );
}