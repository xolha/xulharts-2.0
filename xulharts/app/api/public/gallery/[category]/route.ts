import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages, categorySettings } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/types';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // valida categoria
    if (!GALLERY_CATEGORIES.includes(category as GalleryCategory)) {
      return apiResponse.error('Invalid gallery category', 400);
    }

    // verifica se a categoria está publicada
    const [settings] = await db
      .select()
      .from(categorySettings)
      .where(eq(categorySettings.category, category as GalleryCategory))
      .limit(1);

    // se categoria não está publicada, retorna mensagem "em breve"
    if (!settings || !settings.isPublished) {
      return apiResponse.success({
        category,
        isPublished: false,
        message: settings?.comingSoonMessage || 'Em breve!',
        images: [],
      });
    }

    // busca imagens do banco de dados, ordenadas por displayOrder
    const images = await db
      .select({
        id: galleryImages.id,
        url: galleryImages.url,
        altText: galleryImages.altText,
        displayOrder: galleryImages.displayOrder,
      })
      .from(galleryImages)
      .where(eq(galleryImages.category, category as GalleryCategory))
      .orderBy(asc(galleryImages.displayOrder));

    return apiResponse.success({
      category,
      isPublished: true,
      images,
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    return apiResponse.serverError('Failed to fetch gallery images');
  }
}
