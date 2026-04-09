"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Toast from "./ui/Toast";
import { type GalleryCategory } from "@/lib/types";

export type GalleryHandle = {
  triggerFileInput: () => void;
  save: () => Promise<void>;
};

type SavedItem = {
  kind: "saved";
  id: number;
  url: string;
  altText?: string | null;
};

type PendingItem = {
  kind: "pending";
  tempId: string;
  preview: string;
  file: File;
};

type GalleryItem = SavedItem | PendingItem;

interface GalleryProps {
  category: GalleryCategory;
  hideButtons?: boolean;
}

const Gallery = forwardRef<GalleryHandle, GalleryProps>(function Gallery({ category, hideButtons }, ref) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/gallery/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.images) {
          const saved: SavedItem[] = data.data.images.map((img: { id: number; url: string; altText?: string | null }) => ({
            kind: "saved",
            id: img.id,
            url: img.url,
            altText: img.altText,
          }));
          setItems(saved);
        }
      })
      .catch(console.error);
  }, [category]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPending: PendingItem[] = files.map((file) => ({
      kind: "pending",
      tempId: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      file,
    }));
    setItems((prev) => [...prev, ...newPending]);
    e.target.value = "";
  };

  const handleDragStart = (index: number) => {
    setDragFrom(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toIndex: number) => {
    if (dragFrom === null || dragFrom === toIndex) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragFrom(null);
  };

  const handleDelete = async (item: GalleryItem, index: number) => {
    if (item.kind === "pending") {
      // apenas remove do estado local
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      const res = await fetch(`/api/admin/gallery/image/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Exclusão falhou");
      setItems((prev) => prev.filter((_, i) => i !== index));
      setToast({ message: "Imagem excluída com sucesso!", type: "success" });
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setToast({ message: "Erro ao excluir a imagem.", type: "error" });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // upload dos itens pendentes
      const uploadedIds: Record<string, number> = {};
      for (const item of items) {
        if (item.kind !== "pending") continue;
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await fetch(`/api/admin/gallery/${category}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Upload falhou");
        uploadedIds[item.tempId] = data.data.id;
      }

      // monta lista final com ids reais
      const imageOrders = items.map((item, index) => ({
        id: item.kind === "saved" ? item.id : uploadedIds[item.tempId],
        displayOrder: index,
      }));

      // salva a ordem
      await fetch(`/api/admin/gallery/${category}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageOrders }),
      });

      // converte pendentes para saved no estado
      setItems((prev) =>
        prev.map((item) => {
          if (item.kind === "saved") return item;
          return {
            kind: "saved",
            id: uploadedIds[item.tempId],
            url: item.preview,
            altText: null,
          };
        })
      );
      setToast({ message: "Galeria salva com sucesso!", type: "success" });
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setToast({ message: "Erro ao salvar a galeria.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => fileInputRef.current?.click(),
    save: handleSave,
  }));

  const itemKey = (item: GalleryItem) =>
    item.kind === "saved" ? `saved-${item.id}` : item.tempId;

  const itemUrl = (item: GalleryItem) =>
    item.kind === "saved" ? item.url : item.preview;

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {!hideButtons && (
        <div className="flex flex-row justify-center items-center">
          <Button onClick={() => fileInputRef.current?.click()}>
            Enviar imagem
          </Button>
          <Button variant="roxo" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {items.length > 0 && (
        <div className="flex flex-wrap gap-4 p-4">
          {items.map((item, index) => (
            <div
              key={itemKey(item)}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`cursor-grab active:cursor-grabbing ${dragFrom === index ? "opacity-50" : ""}`}
            >
              <Card
                id={itemKey(item)}
                imageUrl={itemUrl(item)}
                readOnly
                onDelete={() => handleDelete(item, index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Gallery;
