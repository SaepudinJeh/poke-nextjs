"use client";

import { ENV } from "@/libs/constants/env.constants";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import Drawer from 'react-modern-drawer';

import 'react-modern-drawer/dist/index.css'
import Swal from "sweetalert2";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    const [username, setUsername] = useState<string>("")

    const [{ data, error }, refetch] = useAxios(
        {
          baseURL: `${ENV.BASE_URL}/my-deck`,
          method: "POST",
          data: { username },
        },
        { manual: true }
      );

    const getCrendential = sessionStorage.getItem('credential');

    useEffect(() => {
        if(!getCrendential) {
                let nameInput: HTMLInputElement;
                Swal.fire({
                  title: "Login With Username",
                  html: `
                            <input type="text" id="name" class="swal2-input" placeholder="Username...">
                        `,
                  confirmButtonText: "Login",
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
                      Swal.showValidationMessage(`Please enter username!`);
                    }
                    setUsername(name);
                  },
                })
            } else {
                if(getCrendential) {
                    if(getCrendential?.length > 0) {
                        setUsername(getCrendential)
                    }
                }
            }
    }, [getCrendential]);
    
    useEffect(() => {
        if(data?.statusCode === 200) {
            sessionStorage.setItem("credential", username)
        }
    }, [data])

    useEffect(() => {
        if(username.length > 0) {
            refetch()
        }
    }, [username])

    return (
        <nav className="flex items-center justify-between py-4 px-6 bg-white fixed top-0  max-w-xl w-full shadow">
            <button onClick={toggleDrawer}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/></svg></button>

            <div>
                { username }
            </div>

            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='left'
                className='p-10 flex items-center flex-col gap-y-5'
            >
                <Link href="/" scroll={false} className="">
                    Home
                </Link>
                <Link href="/my-desk" scroll={false} className="">
                    My Desk
                </Link>
            </Drawer>
        </nav>
    )
}