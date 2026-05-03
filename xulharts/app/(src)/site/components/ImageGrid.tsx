"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface HeroImage {
  url: string
  altText: string | null
}

interface Props {
  images: Record<string, HeroImage>
  content: Record<string, string>
}

const fadeDown = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
}

export default function ImageGrid({ images, content }: Props) {
  const [openImage, setOpenImage] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-evenly items-center py-8 px-4 gap-6">

        <motion.div
          initial={fadeDown.initial}
          whileInView={fadeDown.animate}
          transition={fadeDown.transition}
          viewport={{ once: true }}
          className="flex flex-col justify-center items-center gap-6"
        >
          {images.home_emotes && (
            <div
              className="bg-rosado rounded-3xl w-[80vw] h-[60vw] sm:w-[60dvh] sm:h-[70dvh] relative overflow-hidden flex justify-center cursor-pointer"
              onClick={() => setOpenImage(images.home_emotes.url)}
            >
              <h1 className="absolute text-white font-coiny text-2xl p-2 b-0 text-center">
                {content.info_1}
              </h1>
              <Image
                src={images.home_emotes.url}
                alt={images.home_emotes.altText ?? "emotes"}
                fill
                className="object-contain p-2 pt-8"
              />
            </div>
          )}
          {images.home_corpo && (
            <div
              className="bg-roxo rounded-3xl w-[80vw] h-[60vw] sm:w-[60dvh] sm:h-[70dvh] relative flex justify-center overflow-hidden cursor-pointer"
              onClick={() => setOpenImage(images.home_corpo.url)}
            >
              <h1 className="absolute text-white font-coiny text-2xl p-2 b-0 text-center">
                {content.info_3}
              </h1>
              <Image
                src={images.home_corpo.url}
                alt={images.home_corpo.altText ?? "corpo"}
                fill
                className="object-contain p-2 pt-8"
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={fadeDown.initial}
          whileInView={fadeDown.animate}
          transition={fadeDown.transition}
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          {images.home_badges && (
            <div
              className="bg-amarelo rounded-3xl w-[80vw] h-[60vw] sm:w-[60dvh] sm:h-[70dvh] relative flex justify-center overflow-hidden cursor-pointer"
              onClick={() => setOpenImage(images.home_badges.url)}
            >
              <h1 className="absolute text-white font-coiny text-2xl p-2 b-0 text-center">
                {content.info_2}
              </h1>
              <Image
                src={images.home_badges.url}
                alt={images.home_badges.altText ?? "badges"}
                fill
                className="object-contain p-2 pt-8"
              />
            </div>
          )}
          {images.home_chibi && (
            <div
              className="bg-magenta rounded-3xl w-[80vw] h-[60vw] sm:w-[60dvh] sm:h-[70dvh] relative overflow-hidden flex justify-center cursor-pointer"
              onClick={() => setOpenImage(images.home_chibi.url)}
            >
              <h1 className="absolute text-white font-coiny text-2xl p-2 b-0 text-center">
                {content.info_4}
              </h1>
              <Image
                src={images.home_chibi.url}
                alt={images.home_chibi.altText ?? "chibi"}
                fill
                className="object-contain p-2 pt-8"
              />
            </div>
          )}
        </motion.div>

      </div>

      {openImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
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
