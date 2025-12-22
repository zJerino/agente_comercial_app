/**
 * Pantalla de carga
 */
export function LoaderFull({ className = '', text = 'Espera un momento', sub = '' }) {
  return (
    <div className={"absolute w-[100vw] h-[100svh] flex flex-col justify-center items-center gap-3 bg-gray-200 bg-opacity-25 " + className}>
      <svg className="spinner-ring size-[3.5rem]" viewBox="25 25 50 50" strokeWidth="5">
        <circle cx="50" cy="50" r="20" />
      </svg>
      <div className="flex flex-col gap-1 justify-center items-center">
        <h5 className="text-black-500 text-[1rem]">{text}</h5>
        {sub.length > 0 ? <h6 className="text-stone-300 text-[0.85rem]">{sub}</h6> : ''}
      </div>
    </div>
  );
}

export function LoaderInContent({ text = 'Cargando', sub = '' }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-3">
      <svg className="spinner-ring size-[3.5rem]" viewBox="25 25 50 50" strokeWidth="5">
        <circle cx="50" cy="50" r="20" />
      </svg>
      <h4 className="mx-auto text-stone-400">{text}</h4>
      {sub.length > 0 ? <h6 className="text-stone-300 text-[0.85rem]">{sub}</h6> : ''}
    </div>
  )
}

export function Spinner({ className = '' }) {
  return (
    <svg className={"spinner-ring " + className } viewBox="25 25 50 50" strokeWidth="5">
      <circle cx="50" cy="50" r="20" />
    </svg>
  )
}