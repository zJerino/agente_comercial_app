import DolarPrice from '../components/DolarPrice';

export default function Home() {
    const commitHash = process.env.REACT_APP_VERSION_ID;
    let version = commitHash ? <small className="text-gray-300 text-center text-[0.75rem] mt-auto">Version: {commitHash.substring(0, 7)}</small> : '';

    return (
        <div className="flex flex-col gap-1 h-full">
            <DolarPrice />
            {version}
        </div>
    );
}