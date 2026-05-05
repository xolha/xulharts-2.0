import { StarsBackground } from "@/components/ui/stars-background"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

export default function ArtesMao() {
  return (
    <div className="bg-roxo-escuro min-h-screen flex flex-col">
      <div className="flex-1">
        <header className="px-8 sm:px-32 py-8 pb-12">
          <NavBar />
        </header>
        <main className="relative flex-1">
          <StarsBackground className="absolute inset-0" />
          <div className="">

          </div>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}
