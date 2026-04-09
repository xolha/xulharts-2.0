"use client"
import { useEffect, useRef, useState } from "react"
import { DotBackground } from "@/components/ui/dot-background"
import NavBar from "../components/NavBar"
import { Box } from "lucide-react"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import GeneralInfo from "../components/ui/GeneralInfo"
import Gallery, { type GalleryHandle } from "../components/Gallery"
import Toast from "../components/ui/Toast"

export default function Pop() {
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const galleryRef = useRef<GalleryHandle>(null)

  useEffect(() => {
    fetch("/api/public/content/biscuit_pop")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.content) {
          setPrice(data.data.content.price ?? "")
          setDescription(data.data.content.description ?? "")
        }
      })
      .catch(console.error)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await Promise.all([
        fetch("/api/admin/content/biscuit_pop/price", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: price })
        }),
        fetch("/api/admin/content/biscuit_pop/description", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: description })
        })
      ])
      await galleryRef.current?.save()
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
            <Box className="h-5 w-5" />
            Pop
          </h2>

          <div className="flex flex-row justify-center items-center mt-6">
            <Button onClick={() => galleryRef.current?.triggerFileInput()}>
              Enviar Imagens
            </Button>
            <Button variant="roxo" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>

          <div className="flex flex-row justify-center items-center pt-12 gap-24">
            <Card id="pop-hero" />
            <GeneralInfo
              price={price}
              description={description}
              onPriceChange={setPrice}
              onDescriptionChange={setDescription}
            />
          </div>

          <hr className="border-t-2 border-roxo-escuro m-4 mt-24" />

          <Gallery ref={galleryRef} category="biscuit_pop" hideButtons />
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
