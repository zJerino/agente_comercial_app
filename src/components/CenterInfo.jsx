import { Link } from 'react-router';

export default function Main({ text = '', sub = '', btns = [], icon = '', classes={} }) {
    let Btn = null;
    if (Array.isArray(btns) && btns.length > 0) {
        Btn = btns.filter(item => (typeof item === 'object' && item.link)).map((item, key) => {
            return (
                <Link key={key} className={"btn "+ (item.bg ? item.bg : 'btn-solid-primary') +" mx-2 btn-block text-sm gap-2"} to={item.link}>
                    {item.icon?.length > 0 ? <i className={"bi bi-" + item.icon}></i> : ''}
                    <span>{item.text}</span>
                </Link>
            )
        });
    }
    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-3">
            {icon.length > 0 ? <i className={"bi bi-"+ icon + ' ' +(classes?.icon || "text-[4rem] text-stone-300 flex justify-center items-center")}></i> : ''}
            
            <div className="flex flex-col mx-4 text-stone-400 text-center">
                <h4 className={ classes?.text || "mx-auto font-[600]"}>{text}</h4>
                {sub.length > 0 ? <h6 className={classes?.sub || "text-[0.85rem]"}>{sub}</h6> : ''}
            </div>
            
            {Btn !== null ? <div className="flex flex-col mx-4 gap-3"> {Btn} </div> : ''}
        </div>
    )
}