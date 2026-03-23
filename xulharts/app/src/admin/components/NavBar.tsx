"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Minha_logo } from "assets";
import {
  House,
  Pencil,
  Monitor,
  DollarSign,
  Box,
  Heart,
  Flame,
  Info,
  LogOut,
} from "lucide-react";

const iconClass = "text-white h-5 w-5 shrink-0";

const links = [
  {
    label: "Home",
    href: "/src/admin/home",
    icon: <House className={iconClass} />,
  },
  {
    label: "Artes a Mão",
    href: "/src/admin/artes_a_mao",
    icon: <Pencil className={iconClass} />,
  },
  {
    label: "Artes Digitais",
    href: "/src/admin/artes_digitais",
    icon: <Monitor className={iconClass} />,
  },
  {
    label: "Comissão",
    href: "/src/admin/comissao",
    icon: <DollarSign className={iconClass} />,
  },
  {
    label: "Pop",
    href: "/src/admin/pop",
    icon: <Box className={iconClass} />,
  },
  {
    label: "Chibi",
    href: "/src/admin/chibi",
    icon: <Heart className={iconClass} />,
  },
  {
    label: "Anime",
    href: "/src/admin/anime",
    icon: <Flame className={iconClass} />,
  },
  {
    label: "Sobre",
    href: "/src/admin/sobre",
    icon: <Info className={iconClass} />,
  },
  {
    label: "Sair",
    href: "/",
    icon: <LogOut className={iconClass} />,
  },
];

export default function NavBar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <LogoIcon />
            <div className="mt-8 flex flex-col gap-2 p-1">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

const LogoIcon = () => (
  <a href="/src/admin/home" className="relative z-20 flex justify-center py-1">
    <Image src={Minha_logo} alt="Xulharts" width={100} height={100} />
  </a>
)
