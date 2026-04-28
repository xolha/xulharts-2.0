"use client";
import React, { useState, useRef } from "react";
import { IconTrash } from "@tabler/icons-react";

interface CardProps {
  id: string;
  imageUrl?: string;
  onFileChange?: (file: File) => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

export default function Card({ id, imageUrl, onFileChange, onDelete, readOnly = false }: CardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange?.(file);
    }
  };

  const displayImage = preview || imageUrl;

  return (
    <div className="relative w-80.5 h-100.5 flex flex-col items-stretch justify-start bg-linear-to-b from-lilas to-roxo/70 p-4 rounded-[2rem]">
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-6 right-6 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 text-red-500 hover:text-red-600 transition-colors"
          aria-label="Excluir imagem"
        >
          <IconTrash size={18} />
        </button>
      )}
      <div
        className={`bg-white rounded-3xl flex-1 flex items-center justify-center overflow-hidden ${!readOnly ? "cursor-pointer" : ""}`}
        onClick={!readOnly ? () => inputRef.current?.click() : undefined}
      >
        {!readOnly && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            id={id}
            onChange={handleImageChange}
          />
        )}
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            className="h-full w-full object-cover rounded-3xl"
          />
        ) : (
          <label
            htmlFor={!readOnly ? id : undefined}
            className={!readOnly ? "cursor-pointer font-inria text-gray-400" : "font-inria text-gray-400"}
          >
            Imagem
          </label>
        )}
      </div>
    </div>
  );
}
