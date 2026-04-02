import { DotBackground } from "@/components/ui/dot-background"
import NavBar from "../components/NavBar"
import { DollarSign } from "lucide-react"
import Gallery from "../components/Gallery"

export default function Comissoes() {
  return (
    <NavBar>
      <DotBackground>
        <div className="p-12">
          <h1 className="text-2xl font-inria font-bold">Olá, Júlia! :D</h1>
          <h2 className="text-md font-inria mt-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Comissões
          </h2>

          <div>
            <Gallery category="comissoes"/>
          </div>
        </div>
      </DotBackground>
    </NavBar>
  )
}
