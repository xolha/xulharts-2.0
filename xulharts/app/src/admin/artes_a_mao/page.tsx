import { DotBackground } from "@/components/ui/dot-background"
import NavBar from "../components/NavBar"
import { Pencil } from "lucide-react"
import Gallery from "../components/Gallery"

export default function ArtesMao() {
  return (
    <NavBar>
      <DotBackground>
        <div className="p-12">
          <h1 className="text-2xl font-inria font-bold">Olá, Júlia! :D</h1>
          <h2 className="text-md font-inria mt-3 flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Artes a Mão
          </h2>

          <div>
            <Gallery category="artes_a_mao" />
          </div>
        </div>
      </DotBackground>
    </NavBar>
  )
}
