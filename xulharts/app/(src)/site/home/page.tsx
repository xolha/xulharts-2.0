import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import Image from "next/image"
import { Minha_logo } from "../../assets"
import { BackgroundLines } from "@/components/ui/background-lines"
import { StarsBackground } from "@/components/ui/stars-background"
import { db } from "@/lib/db"
import { heroImages, pageContent } from "@/lib/db/schema"
import { eq, or } from "drizzle-orm"
import ImageGrid from "../components/ImageGrid"
import { motion } from "framer-motion"
import InfoSection from "../components/InfoSection"

export default async function Home() {
  const [images, contentRows] = await Promise.all([
    db
      .select({
        slot: heroImages.slot,
        url: heroImages.url,
        altText: heroImages.altText
      })
      .from(heroImages)
      .where(
        or(
          eq(heroImages.slot, "home_emotes"),
          eq(heroImages.slot, "home_badges"),
          eq(heroImages.slot, "home_corpo"),
          eq(heroImages.slot, "home_chibi")
        )
      ),
    db
      .select({ fieldKey: pageContent.fieldKey, content: pageContent.content })
      .from(pageContent)
      .where(eq(pageContent.page, "home"))
  ])

  const imageMap = Object.fromEntries(
    images.map((img) => [img.slot, { url: img.url, altText: img.altText }])
  )
  const contentMap = Object.fromEntries(
    contentRows.map((row) => [row.fieldKey, row.content])
  )

  return (
    <div className="bg-roxo-escuro min-h-screen flex flex-col">
      <div className="flex-1">
        <BackgroundLines className="bg-roxo px-16 py-8 pb-12">
          <header>
            <NavBar />
            <div className="flex flex-row justify-evenly items-center">
              <Image
                src={Minha_logo}
                alt="júlia hero section"
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <h1 className="text-white font-bold text-4xl font-inria">
                  Desenhista e Artesã
                </h1>
                <h1 className="text-white font-bold text-4xl font-inria">
                  nas horas vagas!
                </h1>
              </div>
            </div>
          </header>
        </BackgroundLines>

        <main className="relative flex-1">
          <StarsBackground className="absolute inset-0" />

          <div
            className="relative z-10"
          >
            <ImageGrid images={imageMap} content={contentMap} />

            <InfoSection />
          </div>
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}
