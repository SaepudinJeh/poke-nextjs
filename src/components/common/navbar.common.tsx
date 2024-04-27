"use client";

import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import { useState } from "react";
import Drawer from 'react-modern-drawer';

import 'react-modern-drawer/dist/index.css'

export default function Navbar() {
    const { user } = useAuth()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    return (
        <nav className="flex items-center justify-between py-4 px-6 bg-white fixed top-0  max-w-xl w-full shadow">
            <button onClick={toggleDrawer}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/></svg></button>

            <div>
                { user }
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
                <Link href="/my-deck" scroll={false} className="">
                    My Deck
                </Link>
            </Drawer>
        </nav>
    )
}