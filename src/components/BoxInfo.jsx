export default function Main({ bgColor = 'gray-200', textColor = 'black', icon = 'box-seam-fill', title = "", text = ''}) {
    return (
        <div className={"bg-" + bgColor + " rounded-[1rem] px-4 py-3 text-"+ textColor +" flex items-center gap-2"}>
            <i className={"bi bi-"+icon+" text-[2.5rem]"}></i>
            <div className="flex flex-col grow-[1]">
                {title.length > 0 ? (
                    <div className="flex flex-row leading-[.85rem]">
                        <span className="font-[700] fv-small">{title}</span>
                    </div>
                ) : null}
                {String(text).length > 0 ? (
                    <h3 className="text-[1.25rem] font-[500]">
                        <span>{String(text)}</span>
                    </h3>
                ) : null}
            </div>
        </div>
    )
}