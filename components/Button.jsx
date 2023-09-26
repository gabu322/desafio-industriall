import Link from 'next/link';

export default function Button({ children, href, type, onClick, width, height, color}) {

    if (color == "red") {
        color = " bg-red-500 hover:bg-red-600";
    } else if (color == "green") {
        color = " bg-green-500 hover:bg-green-600";
    } else if (color == "yellow") {
        color = " bg-yellow-500 hover:bg-yellow-600";
    } else if (color == "gray") {
        color = " bg-gray-500 hover:bg-gray-600";
    } else {
        color = " bg-blue-500 hover:bg-blue-600";
    }

    return (
        <button type={type ?? "button"}
            className={"px-3 py-2 rounded text-white drop-shadow transition-all duration-200 cursor-pointer font-semibold text-sm my-auto" + color}
            style={{
                width: width ?? "fit-content",
                height: height ?? "fit-content"
            }}
            onClick={onClick}
        >
            {children}
            {href && ( <Link href={href} className='top-0 left-0 absolute w-full h-full' />)}
        </button>
    );
}
