import DolarPrice from '../components/DolarPrice';

export default function Home() {
    const commitHash = process.env.REACT_APP_VERSION_ID;
    const shortHash = commitHash ? commitHash.substring(0, 7) : '';

    return (
        <div className="flex flex-col gap-1">
            <DolarPrice />

            <small className="text-gray-200 text-[0.25rem] my-auto">Version: {shortHash}</small>
        </div>
    );
}