"use client";

import useAxios from "axios-hooks";
import Image from "next/image";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

import BackgroundImage from "../../../assets/bg.jpg";
import PokeBallImage from "../../../assets/4.svg";
import Loader from "@/components/micro/loader.micro";
import { ENV } from "@/libs/constants/env.constants";
import { useRouter } from "next/navigation";

interface IDataCatch {
  poke: string | null;
  username: string | null;
}

export default function DetailPoke({ params }: { params: { name: string } }) {
  const router = useRouter();

  const [loadingCatch, setLoadingCatch] = useState<boolean>(false);

  const [{ data, loading, error }] = useAxios(
    `${ENV.BASE_URL}/poke/${params.name}`
  );
  const [dataCatch, setDataCatch] = useState<IDataCatch>({
    poke: params?.name,
    username: "So'Nice",
  });

  const [{ data: responseCatch, error: errorCatch }, refetch] = useAxios(
    {
      baseURL: `${ENV.BASE_URL}/catch-probability`,
      method: "POST",
      data: dataCatch,
    },
    { manual: true }
  );

  const handleCatch = () => {
    setLoadingCatch(true);

    return setTimeout(() => {
      refetch();
      setLoadingCatch(false);
    }, 5000);
  };

  useMemo(() => {
    if(errorCatch) {
        Swal.fire({
        title: "Error!",
        icon: "error",
        didClose() {
            router.push("/");
        },
        });
    }
  }, [errorCatch]);

  useMemo(() => {
    if (responseCatch) {
        if(responseCatch?.data?.message?.includes("Poke already saved!")) {
            Swal.fire({
                title: "Pokemon Already Saved!",
                icon: "success",
                didClose() {
                  router.push("/");
                },
              });
        } else if (responseCatch?.data?.probability) {
        Swal.fire({
          title: `${params?.name} pokemon was captured`,
          icon: "success",
          didClose() {
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



                return { name };
              },
            });
          },
        });
      } else {
          Swal.fire({
            title: `${params?.name} pokemon escapes!`,
            icon: "error",
            didClose() {
              return router.push("/");
            },
          });
      }

    }
  }, [responseCatch]);

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center p-10 w-full max-w-xl bg-gray-100 mx-auto shadow-lg overflow-hidden relative">
        <Image
          src={BackgroundImage}
          className="absolute inset-0 w-full h-full object-cover blur"
          priority
          alt="bg"
        />

        {data?.data?.sprites?.front_default && (
          <div className="bg-opacity-75 rounded-lg z-50 relative w-56">
            {/* <Image src={data?.data?.sprites?.other?.home?.front_default} alt={data?.data?.name} fill sizes="100vw" className="h-44 w-44 relative"/> */}
            <Image
              src={data?.data?.sprites?.other?.home?.front_default}
              alt={data?.data?.name}
              width={10000}
              height={10000}
            />
            <div className="shadow bg-black/80 h-10 -inset-x-10 blur-md rounded-[500px] w-1/2 mx-auto absolute -bottom-5 -z-10" />
          </div>
        )}

        {!loadingCatch ? (
          <div
            className="fixed mx-auto bottom-20 animate-bounce "
            onClick={() => handleCatch()}
          >
            <Image
              src={PokeBallImage}
              alt="poke ball"
              priority
              className="object-cover w-32"
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
