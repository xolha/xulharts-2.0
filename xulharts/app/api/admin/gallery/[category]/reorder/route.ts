import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory, type ReorderRequest } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function PATCH(
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

    // faz parse do body da requisição
    const body: ReorderRequest = await request.json();

    if (!body.imageOrders || !Array.isArray(body.imageOrders)) {
      return apiResponse.error('Invalid request body', 400);
    }

    // atualiza ordens de exibição em uma transaction
    await db.transaction(async (tx) => {
      for (const { id, displayOrder } of body.imageOrders) {
        await tx
          .update(galleryImages)
          .set({
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(galleryImages.id, id));
      }
    });

    return apiResponse.success({ message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    return apiResponse.serverError('Failed to reorder images');
  }
}
