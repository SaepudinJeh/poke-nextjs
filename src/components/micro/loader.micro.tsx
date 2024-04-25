import PokeBall from "@/assets/4.svg";
import Image from "next/image";

export default function LoaderCathing() {
    return (
        <div className="duration-500 z-[999] w-full min-h-screen flex flex-col items-center justify-center absolute top-0">
            <div className="min-h-screen min-w-full blur z-10 absolute top-0 bg-white/60" />
            <div className="w-44 bg-white h-28 pb-10 shadow rounded-xl flex flex-col items-center justify-center z-20">
                <Image src={PokeBall} alt="poke ball" className="w-20 animate-bounce" />
                <p>Catching....</p>
            </div>
        </div>
    )
}