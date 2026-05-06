"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"

interface ArtesMao {
  url: string
  altText: string | null
}

interface Props {
  images: ArtesMao[]
}

const fadeDown = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
}

export default function ImageArtesMao({ images }: Props) {
  const [openImage, setOpenImage] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-evenly items-center py-8 px-4 gap-6">
        <div className="columns-1 sm:columns-2 gap-4 px-8 py-8">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => setOpenImage(img.url)}
              initial={fadeDown.initial}
              whileInView={fadeDown.animate}
              transition={fadeDown.transition}
              viewport={{ once: true }}
            >
              <Image
                src={img.url}
                alt={img.altText ?? "Desenhos feitos à mão :)"}
                width={0}
                height={0}
                sizes="10vw"
                className="w-122 h-auto rounded-lg"
                unoptimized
              />
            </motion.div>
          ))}
        </div>
      </div>

      {openImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center animate-in fade-in duration-300 justify-center"
          onClick={() => setOpenImage(null)}
        >
          <img
            src={openImage}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
