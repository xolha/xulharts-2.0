import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { categorySettings } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/types';
import { eq } from 'drizzle-orm';

// GET: lê as configurações atuais da categoria
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

    const [settings] = await db
      .select()
      .from(categorySettings)
      .where(eq(categorySettings.category, category as GalleryCategory))
      .limit(1);

    if (!settings) {
      return apiResponse.notFound('Category settings');
    }

    return apiResponse.success({
      category: settings.category,
      isPublished: settings.isPublished,
      comingSoonMessage: settings.comingSoonMessage,
    });
  } catch (error) {
    console.error('Get category settings error:', error);
    return apiResponse.serverError('Failed to get category settings');
  }
}

// PATCH: atualiza configurações da categoria com os valores recebidos no body
export async function PATCH(
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

    const body = await request.json();
    const { isPublished, comingSoonMessage } = body;

    if (typeof isPublished !== 'boolean') {
      return apiResponse.error('isPublished deve ser um booleano', 400);
    }

    const [updatedSettings] = await db
      .update(categorySettings)
      .set({
        isPublished,
        comingSoonMessage: comingSoonMessage ?? 'Em breve!',
        updatedAt: new Date(),
      })
      .where(eq(categorySettings.category, category as GalleryCategory))
      .returning();

    return apiResponse.success({
      category: updatedSettings.category,
      isPublished: updatedSettings.isPublished,
      comingSoonMessage: updatedSettings.comingSoonMessage,
    });
  } catch (error) {
    console.error('Update category settings error:', error);
    return apiResponse.serverError('Failed to update category settings');
  }
}
