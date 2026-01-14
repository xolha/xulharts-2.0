import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { categorySettings } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/types';
import { eq } from 'drizzle-orm';

// PATCH: alterna estado de publicação da categoria
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

    // busca configuração atual da categoria
    const [currentSettings] = await db
      .select()
      .from(categorySettings)
      .where(eq(categorySettings.category, category as GalleryCategory))
      .limit(1);

    if (!currentSettings) {
      return apiResponse.notFound('Category settings');
    }

    // alterna o estado de publicação
    const [updatedSettings] = await db
      .update(categorySettings)
      .set({
        isPublished: !currentSettings.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(categorySettings.category, category as GalleryCategory))
      .returning();

    return apiResponse.success({
      category: updatedSettings.category,
      isPublished: updatedSettings.isPublished,
      comingSoonMessage: updatedSettings.comingSoonMessage,
      updatedAt: updatedSettings.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Publish toggle error:', error);
    return apiResponse.serverError('Failed to toggle publish status');
  }
}
