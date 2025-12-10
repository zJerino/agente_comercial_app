export default function Main({ bgColor = 'gray-200', textColor = 'black', icon = 'box-seam-fill', title = "", text = ''}) {
    return (
        <div className={"bg-" + bgColor + " rounded-[1rem] px-4 py-3 text-"+ textColor +" flex items-center gap-2"}>
            <i class={"bi bi-"+icon+" text-[2.5rem]"}></i>
            <div class="flex flex-col grow-[1]">
                {title.length > 0 ? (
                    <div class="flex flex-row leading-[.85rem]">
                        <span class="font-[700] fv-small">{title}</span>
                    </div>
                ) : null}
                {String(text).length > 0 ? (
                    <h3 class="text-[1.25rem] font-[500]">
                        <span>{String(text)}</span>
                    </h3>
                ) : null}
            </div>
        </div>
    )
}