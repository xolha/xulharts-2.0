import { db } from "@/lib/db"
import { galleryImages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import ImageArtesMao from "./ImageArtesMao"

export default async function GaleriaArtesMao() {
  const images = await db
    .select({ url: galleryImages.url, altText: galleryImages.altText })
    .from(galleryImages)
    .where(eq(galleryImages.category, "artes_a_mao"))

  return <ImageArtesMao images={images} />
}
