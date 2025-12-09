import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useLocalStorage, useGeolocation } from "react-use";
import { schema as clientSchema, dbName as clientDB } from '../../configs/clients';
import { tryParseJSON } from '../../configs/utils';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function Main() {
    const [value, setValue] = useLocalStorage(clientDB, "[]");
    const [client, setClient] = useState(clientSchema);
    const [imageUploaded, setImageUpload] = useState(false);
    const geoLoca = useGeolocation();
    const navigate = useNavigate();

    
    useEffect(() => {
        // Solo actualiza si la geolocalización no está cargando y tiene latitud
        if (!geoLoca.loading && geoLoca.latitude) {
        const newGeo = `${geoLoca.latitude} ${geoLoca.longitude}`;
        setClient((c) => ({ ...c, businessGeo: newGeo }));
        }
    }, [geoLoca.loading, geoLoca.latitude, geoLoca.longitude]);

    let imgDefault = 'https://placehold.co/100?text=';

    const data = tryParseJSON(value) || [];

    /**
     * Maneja la captura de imagen y la convierte a Base64 para guardarla en localStorage.
     */
    const handleImageCapture = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setClient((prevClient) => ({
                ...prevClient,
                businessImg: reader.result
            }));
            
            setImageUpload(true);
        };
        reader.onerror = (error) => {
            console.error("Error:", error);
        };

        reader.readAsDataURL(file);
    };

    /**
     * Maneja el guardado del cliente en localStorage
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        const newClient = {
            ...client,
            id: crypto.randomUUID(),
            businessImg: client.businessImg || "" // Usar la imagen por defecto si no se proporciona
        };
      
        const currentClients = Array.isArray(data) ? data : [];

        const updatedData = [...currentClients, newClient];

        setValue(JSON.stringify(updatedData));

        navigate('/clients');
    };
    
    /**
     * Maneja los cambios de los inputs y los guarda en un estado
     */
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (name === 'businessName' && !imageUploaded) {
            setClient((prevClient) => ({
                ...prevClient,
                businessImg: imgDefault + value.charAt(0)
            }));
        }

        setClient((prevClient) => ({
            ...prevClient,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className="flex flex-col my-3">
            <form className="mx-auto flex w-full max-w-md flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <label className="mb-2" htmlFor="imageup">
                        <img className="rounded-full size-[7rem] mx-auto border-[1px]" src={client.businessImg} alt="Me at the park."/>
                        <input type="file" id="imageup" hidden capture="environment" accept="image/*" onChange={handleImageCapture}/>
                    </label>
                    <h1 className="text-3xl font-semibold">Nuevo cliente</h1>
                    <p className="text-sm">Agrega la informacion de tu nuevo cliente</p>
                </div>
                <div className="form-group px-3 sm:px-1">
                    <div className="form-field">
                        <label className="form-label">Nombre del cliente</label>
                        <input placeholder="Type here" name="fullname" type="text" className="input max-w-full" onChange={handleChange}/>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Numero de contacto</label>
                        <PhoneInput placeholder="Type here" name="contactNumber" defaultCountry="ve" className="max-w-full" onChange={(value, meta) => {
                            setClient((prevClient) => ({...prevClient, contactNumber: value}));
                        }} />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Nombre del negocio</label>
                        <input placeholder="Type here" name="businessName" type="text" className="input max-w-full" onChange={handleChange}/>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Direccion del negocio</label>
                        <input placeholder="Type here" name="businessAddress" type="text" className="input max-w-full" onChange={handleChange}/>
                    </div>
                    <div className="form-field">
                        <label className="form-label">Informacion GPS</label>
                        <input placeholder="Type here" name="businessGeo" type="text" readOnly className="input max-w-full" onChange={handleChange} value={client.businessGeo} />
                    </div>
                    <div className="form-field">
                        <div className="form-control justify-between">
                            <div className="flex gap-2">
                                <input type="checkbox" name="hasWhatsapp" id="hasWhatsapp" className="checkbox" onChange={handleChange}/>
                                <label htmlFor="hasWhatsapp">Tiene whatsapp</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-field pt-5">
                        <div className="form-control justify-between">
                            <button type="submit" className="btn btn-primary w-full">Guardar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}