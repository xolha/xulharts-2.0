import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/types';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { category } = await params;

    if (!GALLERY_CATEGORIES.includes(category as GalleryCategory)) {
      return apiResponse.error('Invalid gallery category', 400);
    }

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

    return apiResponse.success({ images });
  } catch (error) {
    console.error('Get gallery error:', error);
    return apiResponse.serverError('Failed to fetch gallery images');
  }
}
