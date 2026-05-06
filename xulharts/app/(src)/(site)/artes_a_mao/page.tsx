import { Suspense } from "react"
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import GaleriaArtesMao from "../components/GaleriaArtesMao"
import { Loader } from "lucide-react"

export default function ArtesMao() {
  return (
    <div className="bg-roxo-escuro min-h-screen flex flex-col">
      <StarsBackground className="fixed inset-0 z-0" allStarsTwinkle />
      <ShootingStars className="fixed inset-0 z-0" minDelay={20} />

      <div className="relative z-10 flex-1">
        <header className="px-8 sm:px-32 py-8 pb-12">
          <NavBar />
        </header>
        <main className="flex-1">
          <Suspense fallback={<p>carregando</p>}>
            <GaleriaArtesMao />
          </Suspense>
        </main>
      </div>
      <footer className="relative z-10">
        <Footer />
      </footer>
    </div>
  )
}
