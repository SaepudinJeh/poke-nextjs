"use client"

import Card from "@/components/micro/card.micro";
import useAxios from "axios-hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter()
  const [{ data, loading, error }, refetch] = useAxios('http://localhost:3000/v1/poke');

  useEffect(() => {refetch}, [refetch])

  useMemo(() => { console.log(data?.data?.data);
   }, [data])

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-10 w-full max-w-xl bg-gray-100 mx-auto shadow-lg">
      <div className="grid grid-cols-2 gap-3 w-full">
        { data?.data?.data && data.data.data.map((val: any) => (
          <Card onClick={async() => router.push(`poke/${val?.name}`)} key={val?.name} height={val?.height} img={val?.img} name={val?.name} weight={val?.weight} />
        )) }
      </div>
    </main>
  );
}
