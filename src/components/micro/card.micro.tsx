"use client"

import Image from "next/image";

export default function Card(props: CardProps) {
    return (
        <div onClick={props.onClick} className="w-full h-full flex flex-col items-start justify-center gap-y-2 bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-lg">
            <div className="w-full h-full overflow-hidden">
                <Image priority alt={props.name} src={props.img} width={500} height={500} className="object-cover" />
            </div>

            <p className="mx-auto text-xl font-medium">{props?.name}</p>

            <div className="flex justify-start gap-2">
                <p className="px-2 py-1 bg-red-200 rounded-full text-xs shadow shadow-red-400 text-red-900 text-medium">Height: {props.height}</p>
                <p className="px-2 py-1 bg-cyan-200 rounded-full text-xs shadow shadow-cyan-400 text-cyan-900 text-medium">Weight: {props.weight}</p>
            </div>
        </div>
    )
}


interface CardProps {
    name: string;
    height: number;
    weight: number;
    img: string;
    onClick: () => {}
}