"use client"
import { useEffect, useState } from "react"
import { DotBackground } from "@/components/ui/dot-background"
import NavBar from "../components/NavBar"
import { Info } from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Toast from "../components/ui/Toast"

export default function Sobre() {
  const [description, setDescription] = useState("")
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/public/content/about")
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.content) {
            setDescription(data.data.content.content ?? "")
          }
        }),
      fetch("/api/public/hero/about_main")
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.url) {
            setHeroImageUrl(data.data.url)
          }
        }),
    ]).catch(console.error)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const promises: Promise<Response>[] = [
        fetch("/api/admin/content/about/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: description }),
        }),
      ]

      if (heroFile) {
        const formData = new FormData()
        formData.append("file", heroFile)
        promises.push(
          fetch("/api/admin/hero/about_main", {
            method: "PUT",
            body: formData,
          })
        )
      }

      await Promise.all(promises)
      setHeroFile(null)
      setToast({ message: "Salvo com sucesso!", type: "success" })
    } catch {
      setToast({ message: "Erro ao salvar. Tente novamente.", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <NavBar>
      <DotBackground>
        <div className="p-12">
          <h1 className="text-2xl font-inria font-bold">Olá, Júlia! :D</h1>
          <h2 className="text-md font-inria mt-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sobre
          </h2>

          <div className="flex flex-row justify-around items-center gap-4 pt-6">
            <Card
              id="sobre-hero"
              imageUrl={heroImageUrl}
              onFileChange={(file) => setHeroFile(file)}
            />
            <div className="flex flex-col gap-4">
              <h2 className="font-inria font-bold text-sm text-center">
                Descrição:
              </h2>
              <div className="bg-linear-to-b from-lilas to-roxo/70 rounded-xl w-80.5 h-91.5 p-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mudar texto"
                  className="bg-transparent font-inria text-sm outline-none w-full h-full resize-none placeholder-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6">
            <Button variant="roxo" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DotBackground>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </NavBar>
  )
}
