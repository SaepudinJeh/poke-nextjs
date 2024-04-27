"use client"

import Card from "@/components/micro/card.micro";
import { ENV } from "@/libs/constants/env.constants";
import useAxios from "axios-hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import dynamic from 'next/dynamic'
import AuthProvider from "@/contexts/auth.context";
 
const Navbar = dynamic(() => import("@/components/common/navbar.common"), {
  ssr: false,
})

export default function Home() {
  const router = useRouter()
  const [{ data, loading, error }, refetch] = useAxios(`${ENV.BASE_URL}/poke`);

  useEffect(() => {refetch}, [refetch])

  return (
    <AuthProvider>
    <main className="flex flex-col min-h-screen items-center justify-center p-10 w-full max-w-xl bg-gray-100 mx-auto shadow-lg">
      <Navbar />
      <div className="grid grid-cols-2 gap-3 w-full mt-10">
        { data?.data?.data && data.data.data.map((val: any) => (
          <Card onClick={async() => router.push(`poke/${val?.name}`)} key={val?.name} height={val?.height} img={val?.img} name={val?.name} weight={val?.weight} />
        )) }
      </div>
    </main>
    </AuthProvider>
  );
}
