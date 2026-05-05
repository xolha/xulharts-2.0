import { IconBrandWhatsapp } from "@tabler/icons-react"
import { Github, Instagram } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <div className="bg-roxo px-8">
      <div className="flex justify-around items-center py-4">
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-md font-inria text-white">Redes Sociais</h1>
          <div className="flex flex-row justify-center items-center">
            <Link href="https://www.instagram.com/xulharts/" target="_blank">
              <Instagram
                color="#fff"
                className="cursor-pointer hover:opacity-70 transition-colors"
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm sm:text-md font-inria text-white">Contato</h1>
          <div className="flex flex-row justify-center items-center">
            <Link
              href="https://wa.me/5527996057158?text=Olá!%20Gostaria%20de%20fazer%20uma%20encomenda!"
              target="_blank"
            >
              <IconBrandWhatsapp
                color="#fff"
                className="cursor-pointer hover:opacity-70 transition-colors"
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm sm:text-md font-inria text-white">Desenvolvimento</h1>
          <div className="flex flex-row justify-center items-center">
            <Link
              href="https://github.com/xolha/xulharts-2.0"
              target="_blank"
            >
              <Github
                color="#fff"
                className="cursor-pointer hover:opacity-70 transition-colors"
              />
            </Link>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex justify-center items-center">
        <h1 className="text-white text-md font-inria pb-4 pt-4">
          © Copyright - Júlia (Xulha) Porto Alvarenga - {new Date().getFullYear()}
        </h1>
      </div>
    </div>
  )
}
