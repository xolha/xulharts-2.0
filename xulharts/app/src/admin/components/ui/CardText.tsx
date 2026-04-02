"use client";
import React, { useState, useRef } from "react";
import { Button as MovingBorderWrapper } from "@/components/ui/moving-border";

interface CardTextProps {
  placeholder?: string;
  id: string;
  value: string;
  imageUrl?: string;
  onTextChange: (value: string) => void;
  onFileChange: (file: File) => void;
}

export default function CardText({
  placeholder = "Mudar texto",
  id,
  value,
  imageUrl,
  onTextChange,
  onFileChange,
}: CardTextProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const displayImage = preview || imageUrl;

  return (
    /*<MovingBorderWrapper
      as="div"
      borderRadius="2rem"
      containerClassName="w-72.5 h-82.5"
      borderClassName="bg-[radial-gradient(#5A3C95_40%,transparent_60%)]"
      className="!flex !flex-col !items-stretch !justify-start bg-linear-to-b from-lilas to-roxo/70 p-4 border-none"
      duration={4000}
    >*/
    <div className="w-80.5 h-100.5 flex flex-col items-stretch justify-start bg-linear-to-b from-lilas to-roxo/70 p-4 rounded-[2rem]">
      <input
        className="bg-transparent font-inria text-md text-center placeholder-gray-700 outline-none p-3 mb-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <div
        className="bg-white rounded-3xl flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          id={id}
          onChange={handleImageChange}
        />
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            className="h-full w-full object-cover rounded-3xl"
          />
        ) : (
          <label htmlFor={id} className="cursor-pointer font-inria text-gray-400">
            Imagem
          </label>
        )}
      </div>
      </div>
    /*</MovingBorderWrapper>*/
  );
}
