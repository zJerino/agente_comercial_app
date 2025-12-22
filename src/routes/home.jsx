import DolarPrice from '../components/DolarPrice';
import BoxI from '../components/BoxInfo';
import { GetTotal } from '../models/clients';
import { ProductsModel } from '../models/products';

export default function Home() {
    const commitHash = process.env.REACT_APP_VERSION_ID;
    let version = commitHash ? <small className="text-gray-300 text-center text-[0.75rem] mt-auto">Version: {commitHash.substring(0, 7)}</small> : '';
    let [ clientCount ] = GetTotal();

    /**
     * Totales
     */
    let clientTotal = clientCount;
    let ordersTotal = 0;
    let productsTotal = ProductsModel().getTotal();
    
    return (
        <div className="flex flex-col gap-1 h-full">
            <div className="flex flex-col px-2">
                <span className="font-[700] fv-small w-full">Bienvenido de vuelta</span>
                <DolarPrice />
            </div>
            <div className="flex gap-1 w-full justify-center px-2 flex-col">
                <span className="font-[700] fv-small">Resumen de tus datos</span>            
                <div className="flex flex-row gap-1">
                    <BoxI title="Clientes"  text={clientTotal} bgColor="blue-500 w-1/2" textColor="white" icon="person-fill" />
                    <BoxI title="Productos" text={productsTotal} bgColor="gray-200 w-1/2"/>
                </div>
                <BoxI title="Ordenes" text={ordersTotal} bgColor="green-200 w-full"/>
            </div>
            {version}
        </div>
    );
}