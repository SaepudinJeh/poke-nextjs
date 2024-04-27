"use client";

import Image from "next/image";

export default function Card(props: CardProps) {
  return (
    <div
      onClick={props.onClick}
      className="w-full h-full flex flex-col items-start justify-center gap-y-2 bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-lg"
    >
      <div className="w-full h-full overflow-hidden">
        <Image
          priority
          alt={props.name}
          src={props.img}
          width={500}
          height={500}
          className="object-cover"
        />
      </div>

      <p className="mx-auto text-xl font-medium">{props?.name}</p>

      <div className="flex justify-start gap-2">
        <p className="px-2 py-1 bg-red-200 rounded-full text-xs shadow shadow-red-400 text-red-900 text-medium">
          Height: {props.height}
        </p>
        <p className="px-2 py-1 bg-cyan-200 rounded-full text-xs shadow shadow-cyan-400 text-cyan-900 text-medium">
          Weight: {props.weight}
        </p>
      </div>

      {props?.release ? (
        <div className="flex items-center justify-between w-full gap-x-2 text-white">
          <button
            onClick={props.onEdit}
            name="button release"
            className="text-center w-full py-1 px-5 bg-green-700 rounded-full mt-4 shadow-md shadow-green-800 hover:shadow-green-500"
          >
            Edit
          </button>
          <button
            onClick={props.onRelease}
            name="button release"
            className="text-center w-full py-1 px-5  bg-red-700 rounded-full mt-4 shadow-md shadow-green-800 hover:shadow-green-500"
          >
            Release
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface CardProps {
  name: string;
  height: number;
  weight: number;
  img: string;
  onClick?: () => {};
  release?: boolean;
  onRelease?: () => void;
  onEdit?: () => void;
}
