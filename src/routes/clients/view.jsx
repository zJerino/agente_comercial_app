import { useParams } from 'react-router';
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
    businessImg: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktY2FtZXJhLWZpbGwiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTEwLjUgOC41YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAwIDEgNSAwIi8+CiAgPHBhdGggZD0iTTIgNGEyIDIgMCAwIDAtMiAydjZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjZhMiAyIDAgMCAwLTItMmgtMS4xNzJhMiAyIDAgMCAxLTEuNDE0LS41ODZsLS44MjgtLjgyOEEyIDIgMCAwIDAgOS4xNzIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0uODI4LjgyOEEyIDIgMCAwIDEgMy4xNzIgNHptLjUgMmEuNS41IDAgMSAxIDAtMSAuNS41IDAgMCAxIDAgMW05IDIuNWEzLjUgMy41IDAgMSAxLTcgMCAzLjUgMy41IDAgMCAxIDcgMCIvPgo8L3N2Zz4=",
    businessAddress: '',
    businessGeo: '',
}

export default function Main() {
    const { id } = useParams();
    const [value] = useLocalStorage('clients', "[]");

    const data = tryParseJSON(value) || [];

    const client = data.find((v) => Object.assign({ ...clientSchema }, v).id === id);

    if (client === undefined) {
        <div className="flex flex-col justify-center align-center w-[100vw] h-[100svh]">
            <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
            <h4 className="mx-auto text-stone-400">El cliente que buscas no existe.</h4>
        </div>
    } else {
        return (
            <div className="flex flex-col my-3">
                <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                    <div className="flex flex-col items-center">
                        <label className="mb-2" htmlFor="imageup">
                            <img className="rounded-full size-[7rem] mx-auto border-[1px]" src={client.businessImg} alt="Me at the park." />
                        </label>
                        <h1 className="text-3xl font-semibold">{client.fullname}</h1>
                        <p className="text-sm">{client.contactNumber}</p>
                    </div>
                </div>
            </div>
        );
    }
}