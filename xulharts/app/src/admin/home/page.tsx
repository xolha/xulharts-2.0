"use client"
import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import Button from "../components/ui/Button"
import CardText from "../components/ui/CardText"
import Toast from "../components/ui/Toast"
import { DotBackground } from "@/components/ui/dot-background"
import {
  ImageIcon,
  Palette,
  Home
} from "lucide-react"

const cards = [
  {
    id: "card-1",
    placeholder: "Preço do emote",
    fieldKey: "info_1",
    heroSlot: "home_emotes"
  },
  {
    id: "card-2",
    placeholder: "Preço da badge",
    fieldKey: "info_2",
    heroSlot: "home_badges"
  },
  {
    id: "card-3",
    placeholder: "Corpo",
    fieldKey: "info_3",
    heroSlot: "home_corpo"
  },
  {
    id: "card-4",
    placeholder: "Preço do chibi",
    fieldKey: "info_4",
    heroSlot: "home_chibi"
  }
]

const categoryLabels: Record<string, string> = {
  artes_a_mao: "Artes a Mão",
  artes_digitais: "Artes Digitais",
  comissoes: "Comissões",
  biscuit_pop: "Pop",
  biscuit_chibi: "Chibi",
  biscuit_anime: "Anime"
}

interface CategoryStat {
  category: string
  count: number
  isPublished: boolean
}

export default function AdminHome() {
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [stats, setStats] = useState<CategoryStat[]>([])

  useEffect(() => {
    async function loadData() {
      // carrega os textos
      const contentRes = await fetch("/api/public/content/home")
      if (contentRes.ok) {
        const { data } = await contentRes.json()
        if (data?.content) {
          setTexts(data.content)
        }
      }

      // carrega as imagens
      const imageResults = await Promise.all(
        cards.map(async (card) => {
          const res = await fetch(`/api/public/hero/${card.heroSlot}`)
          if (res.ok) {
            const { data } = await res.json()
            return { slot: card.heroSlot, url: data?.url }
          }
          return { slot: card.heroSlot, url: null }
        })
      )

      const urls: Record<string, string> = {}
      imageResults.forEach(({ slot, url }) => {
        if (url) urls[slot] = url
      })
      setImageUrls(urls)

      // carrega os stats das categorias
      const categories = Object.keys(categoryLabels)
      const statsResults = await Promise.all(
        categories.map(async (cat) => {
          const galleryRes = await fetch(`/api/admin/gallery/${cat}`)
          const galleryData = galleryRes.ok ? await galleryRes.json() : null
          return {
            category: cat,
            count: galleryData?.data?.images?.length ?? 0,
            isPublished: false
          }
        })
      )
      setStats(statsResults)
    }

    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)

    try {
      const promises: Promise<Response>[] = []

      // salva os textos
      for (const card of cards) {
        const text = texts[card.fieldKey]
        if (text !== undefined) {
          promises.push(
            fetch(`/api/admin/content/home/${card.fieldKey}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: text })
            })
          )
        }
      }

      // salva as imagens
      for (const card of cards) {
        const file = files[card.heroSlot]
        if (file) {
          const formData = new FormData()
          formData.append("file", file)
          promises.push(
            fetch(`/api/admin/hero/${card.heroSlot}`, {
              method: "PUT",
              body: formData
            })
          )
        }
      }

      await Promise.all(promises)
      setFiles({})
      setToast({ message: "Salvo com sucesso!", type: "success" })
    } catch {
      setToast({ message: "Erro ao salvar. Tente novamente.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <NavBar>
      <DotBackground>
      <div className="p-12">
        <h1 className="text-2xl font-inria font-bold">Olá, Júlia! :D</h1>
        <h2 className="text-md font-inria mt-3 flex items-center gap-2">
          <Home className="h-5 w-5" />
          Home
        </h2>
      </div>

      <div className="flex gap-2 px-12 py-6 justify-between items-center">
        {cards.map((card) => (
          <CardText
            key={card.id}
            id={card.id}
            placeholder={card.placeholder}
            value={texts[card.fieldKey] || ""}
            imageUrl={imageUrls[card.heroSlot]}
            onTextChange={(val) =>
              setTexts((prev) => ({ ...prev, [card.fieldKey]: val }))
            }
            onFileChange={(file) =>
              setFiles((prev) => ({ ...prev, [card.heroSlot]: file }))
            }
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="roxo" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {stats.length > 0 && (
        <div className="px-12 py-8">
          <h2 className="text-lg font-inria font-bold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Resumo do Portfólio
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.category}
                className="bg-linear-to-br from-lilas  rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-inria font-bold text-sm">
                    {categoryLabels[stat.category]}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold font-inria">
                    {stat.count}
                  </span>
                  <span className="text-sm font-inria text-gray-600 pb-1 flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    {stat.count === 1 ? "imagem" : "imagens"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </DotBackground>
    </NavBar>
  )
}
