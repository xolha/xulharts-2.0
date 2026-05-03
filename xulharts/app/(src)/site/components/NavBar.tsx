"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { useState } from "react"
import { Blink, Minha_logo } from "../../assets"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { createPortal } from "react-dom"

export default function NavMenu() {
  const [logoSrc, setLogoSrc] = useState(Minha_logo)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      <div className="flex justify-between items-center">
        <Image
          src={logoSrc}
          alt="Logo xulharts"
          width={70}
          height={70}
          onMouseOver={() => setLogoSrc(Blink)}
          onMouseOut={() => setLogoSrc(Minha_logo)}
          onClick={() => router.push("/")}
          className="cursor-pointer"
        />

        {/* hamburguer mobile */}
        <button className="md:hidden fixed right-0 pr-8 z-9999" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X color="#fff" /> : <Menu color="#fff" />}
        </button>

        {/* desktop */}

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-10">
            <NavigationMenuLink className="text-white" href="/">
              Home
            </NavigationMenuLink>

            {/*lista do dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white">
                Desenhos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/artes_a_mao">
                  Artes a Mão
                </NavigationMenuLink>
                <NavigationMenuLink href="/artes_digitais">
                  Artes Digitais
                </NavigationMenuLink>
                <NavigationMenuLink href="/comissoes">
                  Comissões
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white">
                Biscuit
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/pop">Pop</NavigationMenuLink>
                <NavigationMenuLink href="/chibi">Chibi</NavigationMenuLink>
                <NavigationMenuLink href="/anime">Anime</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* normal */}
            <NavigationMenuLink className="text-white" href="/sobre">
              Sobre
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* configurações do mobile */}
      {isOpen && createPortal(
        <div className="fixed top-22.5 right-0 flex flex-col md:hidden items-end z-9999 pr-9">
          <div className="rounded-xl flex flex-col bg-white w-32 p-2 items-center">
            <Link
              href="/"
              className="text-md font-inria font-bold rounded-lg py-1.5 px-8.5 hover:bg-roxo hover:text-white"
            >
              Home
            </Link>
            
            <Accordion type="single" collapsible className="w-full">
              {/* desenhos */}
              <AccordionItem value="desenhos" className="border-none">
                <AccordionTrigger className="p-2 text-md font-inria font-bold">
                  Desenhos
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pl-4 pt-1 pb-2">
                  <Link
                    href="/artes_a_mao"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Artes a Mão
                  </Link>
                  <Link
                    href="/artes_digitais"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Artes Digitais
                  </Link>
                  <Link
                    href="/comissoes"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Comissões
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* biscuit */}
              <AccordionItem value="biscuit" className="border-none">
                <AccordionTrigger className="p-2 text-md font-inria font-bold">
                  Biscuit
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 pl-4 pt-1 pb-2">
                  <Link
                    href="/pop"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Pop
                  </Link>
                  <Link
                    href="/chibi"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Chibi
                  </Link>
                  <Link
                    href="/anime"
                    className="text-md font-inria font-bold rounded-lg p-1.5 hover:bg-roxo hover:text-white"
                  >
                    Anime
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              href="/sobre"
              className="text-md font-inria font-bold rounded-lg p-1.5 px-9 hover:bg-roxo hover:text-white"
            >
              Sobre
            </Link>
          </div>
        </div>,
        document.body
      )}
    </nav>
  )
}
