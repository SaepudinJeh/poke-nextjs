"use client"

import Card from "@/components/micro/card.micro";
import { useAuth } from "@/contexts/auth.context";
import { ENV } from "@/libs/constants/env.constants";
import useAxios from "axios-hooks";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Swal from "sweetalert2";

const Navbar = dynamic(() => import("@/components/common/navbar.common"), {
  ssr: false,
})

export default function Home() {
  const { user } = useAuth()

  const [{ data }, refetch] = useAxios({ baseURL: `${ENV.BASE_URL}/my-deck`, method: "POST", data: { username: user } }, { manual: true, autoCancel: false });

  const [{}, refetchRelease] = useAxios({ baseURL: `${ENV.BASE_URL}/release-poke`, method: "POST" }, { manual: true, autoCancel: false });

  const [{}, refetchEdit] = useAxios({ baseURL: `${ENV.BASE_URL}/rename-poke`, method: "POST" }, { manual: true });

  useEffect(() => {
    refetch()
  }, [])

  const handleRelease = (id: number) => {
    refetchRelease({ data: { id } }).then((res) => {
      if(res?.data?.data?.isPrime) {
        Swal.fire({
          title: "Successfully Released the Pokémon",
          icon: "success",
          timerProgressBar: true,
          timer: 1500
        })
        
        refetch()

        return;
      } else {
        Swal.fire({
          title: "Failed To Release The Pokémon",
          icon: "error",
          timerProgressBar: true,
          timer: 1500
        })
      }
    })
  }

  const handleEdit = (id: number) => {
    let nameInput: HTMLInputElement;
        Swal.fire({
          title: "Rename Your Poke",
          html: ` <input type="text" id="name" class="swal2-input" placeholder="Name Poke..."> `,
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

            refetchEdit({ data: { id, name } }).then(() => refetch())
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
