import { Link } from 'react-router';

export default function Home() {
    return (
        <div className="flex flex-col justify-center align-center w-[100vw] h-[100svh]">
            <i className="bi bi-emoji-dizzy-fill text-[4rem] mx-auto mb-3 text-stone-300"></i>
            <h4 className="mx-auto text-stone-400">Esta pagina todavia no existe</h4>
            <Link to="/" className="text-bold px-4 p-3 text-center text-primary mt-2 mx-auto border-primary-200">Volver al inicio</Link>
        </div>
    );
}