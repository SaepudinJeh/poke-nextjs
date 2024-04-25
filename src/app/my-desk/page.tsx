"use client"

import Card from "@/components/micro/card.micro";
import { ENV } from "@/libs/constants/env.constants";
import useAxios from "axios-hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const Navbar = dynamic(() => import("@/components/common/navbar.common"), {
  ssr: false,
})

export default function Home() {
  const router = useRouter()

  const [username, setUsername] = useState<string>(window && window.sessionStorage.getItem('credential')!);
  const [idPoke, setIdPoke] = useState<number | null>();
  const [dataEdit, setDateEdit] = useState<Record<string, any> | null>(null)

  const [{ data }, refetch] = useAxios({
    baseURL: `${ENV.BASE_URL}/my-deck`,
    method: "POST",
    data: { username }
  }, { manual: true, autoCancel: false });

  const [{}, refetchRelease] = useAxios({
    baseURL: `${ENV.BASE_URL}/release-poke`,
    method: "POST",
    data: { id: idPoke }
  }, { manual: true, autoCancel: false });

  const [{ data: responseEdit, loading: loadingEdit, error: errorEdit }, refetchEdit] = useAxios({
    baseURL: `${ENV.BASE_URL}/rename-poke`,
    method: "POST",
    data: dataEdit
  }, { manual: true });

  useEffect(() => {
    const getUsername = window && window.sessionStorage.getItem('credential');    
    if(getUsername) {
      refetch()
    }
  }, [])

  useEffect(() => {
    if(idPoke) {
      refetchRelease()
      refetch()
    }
  }, [idPoke])

  useEffect(() => {
    if(dataEdit) {
      refetchEdit()
      refetch()
    }
  }, [dataEdit])

  useEffect(() => {
    
  }, [])

  const handleRelease = (id: number) => {
    return setIdPoke(id)
  }

  const handleEdit = (id: number) => {
    let nameInput: HTMLInputElement;
        Swal.fire({
          title: "Rename Your Poke",
          html: `
                    <input type="text" id="name" class="swal2-input" placeholder="Name Poke...">
                `,
          confirmButtonText: "Rename Poke",
          focusConfirm: false,
          didOpen: () => {
            const popup = Swal.getPopup()!;
            nameInput = popup.querySelector("#name") as HTMLInputElement;
            nameInput.onkeyup = (event) =>
              event.key === "Enter" && Swal.clickConfirm();
          },
          preConfirm: () => {
            const name = nameInput.value;
            if (!name) {
              Swal.showValidationMessage(`Please enter your poke!`);
            }

            setDateEdit(e => ({ ...e, id, name: name }));

            refetchEdit()
          },
        });
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-10 w-full max-w-xl bg-gray-100 mx-auto shadow-lg">
      <Navbar />
      <div className="grid grid-cols-2 gap-3 w-full mt-10">
        { data?.data?.pokemons && data?.data?.pokemons?.length > 0 ? data?.data?.pokemons?.map((val: any) => (
              <Card release onEdit={() => handleEdit(val?.id)} onRelease={() => handleRelease(val?.id)} key={val?.name} height={val?.height} img={val?.img} name={val?.name} weight={val?.weight} />
            )) : (
              <div className="mx-auto w-full flex items-center justify-center">Your deck empty!</div>
            ) }
            </div>
    </main>
  );
}
