import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/db/schema';
import { uploadImage, ImageValidationError } from '@/lib/storage';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/types';
import { eq, max } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // verifica autenticação
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { category } = await params;

    // valida categoria
    if (!GALLERY_CATEGORIES.includes(category as GalleryCategory)) {
      return apiResponse.error('Invalid gallery category', 400);
    }

    // pega dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = formData.get('altText') as string | null;

    if (!file) {
      return apiResponse.error('No file provided', 400);
    }

    // faz upload para Blob Storage
    const { url, blobId } = await uploadImage(file, `gallery/${category}`);

    // pega próxima ordem de exibição
    const result = await db
      .select({ maxOrder: max(galleryImages.displayOrder) })
      .from(galleryImages)
      .where(eq(galleryImages.category, category as GalleryCategory));

    const displayOrder = (result[0]?.maxOrder ?? -1) + 1;

    // insere no banco de dados
    const [newImage] = await db
      .insert(galleryImages)
      .values({
        category: category as GalleryCategory,
        url,
        blobId,
        altText: altText || null,
        displayOrder,
      })
      .returning();

    return apiResponse.success({
      id: newImage.id,
      category: newImage.category,
      url: newImage.url,
      altText: newImage.altText,
      displayOrder: newImage.displayOrder,
      createdAt: newImage.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof ImageValidationError) {
      return apiResponse.error(error.message, 400);
    }

    console.error('Upload error:', error);
    return apiResponse.serverError('Failed to upload image');
  }
}
