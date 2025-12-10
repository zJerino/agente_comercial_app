import { useParams, useNavigate } from 'react-router';
import { useState } from "react";
import { useClientModel } from '../../models/clients';

export default function Main() {
    const { id } = useParams();
    const [isDeleted, setDelete] = useState(false);
    const navigate = useNavigate();
    const model = useClientModel();

    const client = model.client(id, 'id'); // Obtiene el objeto deseado


    if (client === undefined) {
        if (isDeleted) {
            setTimeout(() => {
                navigate('/clients');
            }, 5000);
            return (
                <div className="flex flex-col justify-center align-center w-full h-full">
                    <i className="bi bi-person-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                    <h4 className="mx-auto text-stone-400">El cliente fue eliminado.</h4>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col justify-center align-center w-full h-full">
                    <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
                    <h4 className="mx-auto text-stone-400">El cliente que buscas no existe.</h4>
                </div>
            );
        }
    } else {
        /**
     * Boton de para ir al mapa
     */
        let mapLink = null;
        let coords = client.businessGeo.split(' ');

        if (coords.length === 2) {
            mapLink = "https://www.google.com/maps/search/?api=1&query=" + coords[0] + "%2C" + coords[1];
        }

        /**
         * WhatsApp link
         */
        let wsLink = null;
        if (client.hasWhatsapp) {
            wsLink = 'https://wa.me/' + client.contactNumber;
        }

        /**
         * Funcion para borrar clientes
         */
        const handleDelete = function () {
            model.delete(id);
            setDelete(true);
        };

        return (
            <>
                <img className="rounded-b-[0.5rem] w-full h-[25vh] min-h-[8rem]" style={{backgroundImage: 'linear-gradient(to top, #0000000a, transparent)'}} src={client.businessImg} alt="Me at the park." />
                <div className="flex flex-col my-3">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-semibold">{client.fullname}</h1>
                            <p className="text-sm">{client.businessName}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 mx-2">
                            <a class="btn btn-solid-primary btn-block justify-start text-start" href={'tel://' + client.contactNumber}>
                                <i className="bi bi-telephone me-2"></i> Llamar
                            </a>
                            {mapLink != null ? (<a class="btn btn-solid-primary btn-block justify-start text-start" href={mapLink} rel="noreferrer" target="_blank"> <i className="bi bi-geo-alt text-[1rem] me-2"></i> Ver mapa </a>) : ''}
                            {wsLink != null ? (<a class="btn btn-solid-success btn-block justify-start text-start" href={wsLink} rel="noreferrer" target="_blank"><i className="bi bi-whatsapp me-2"></i> Ir a WhatsApp</a>) : ''}
                        </div>
                    </div>
                </div>

                <input className="modal-state" id="modal-delete" type="checkbox" />
                <div className="modal">
                    <label className="modal-overlay" htmlFor="modal-delete"></label>
                    <div className="modal-content flex flex-col gap-5">
                        <label htmlFor="modal-delete" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <h2 className="text-xl">¿Seguro de continuar?</h2>
                        <span>Confirma que estas seguro de de borrar este cliente</span>
                        <div className="flex flex-col gap-3">
                            <button className="btn btn-error btn-block" onClick={handleDelete}>Confirmar</button>
                            <label className="btn btn-block" htmlFor="modal-delete">Cancelar</label>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}