import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { heroImages } from '@/lib/db/schema';
import { uploadImage, deleteImage, ImageValidationError } from '@/lib/storage';
import { apiResponse } from '@/lib/utils/response';
import { HERO_SLOTS, type HeroSlot } from '@/lib/types';
import { eq } from 'drizzle-orm';

// PUT: substitui hero image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  try {
    // verifica autenticação
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { slot } = await params;

    // valida slot
    if (!HERO_SLOTS.includes(slot as HeroSlot)) {
      return apiResponse.error('Invalid hero slot', 400);
    }

    // pega dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = formData.get('altText') as string | null;

    if (!file) {
      return apiResponse.error('No file provided', 400);
    }

    // verifica se hero image existe
    const [existingHero] = await db
      .select()
      .from(heroImages)
      .where(eq(heroImages.slot, slot as HeroSlot))
      .limit(1);

    // deleta imagem antiga do Blob Storage se existir
    if (existingHero) {
      try {
        await deleteImage(existingHero.blobId);
      } catch (error) {
        console.error('Failed to delete old blob:', error);
        // continua mesmo se deleção falhar
      }
    }

    // faz upload da nova imagem para Blob Storage
    const { url, blobId } = await uploadImage(file, `hero/${slot}`);

    // faz upsert da hero image
    let heroImage;
    if (existingHero) {
      // atualiza existente
      [heroImage] = await db
        .update(heroImages)
        .set({
          url,
          blobId,
          altText: altText || null,
          updatedAt: new Date(),
        })
        .where(eq(heroImages.slot, slot as HeroSlot))
        .returning();
    } else {
      // insere nova
      [heroImage] = await db
        .insert(heroImages)
        .values({
          slot: slot as HeroSlot,
          url,
          blobId,
          altText: altText || null,
        })
        .returning();
    }

    return apiResponse.success({
      id: heroImage.id,
      slot: heroImage.slot,
      url: heroImage.url,
      altText: heroImage.altText,
      updatedAt: heroImage.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof ImageValidationError) {
      return apiResponse.error(error.message, 400);
    }

    console.error('Hero replace error:', error);
    return apiResponse.serverError('Failed to replace hero image');
  }
}
