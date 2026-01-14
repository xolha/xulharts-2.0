import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { heroImages } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { HERO_SLOTS, type HeroSlot } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  try {
    const { slot } = await params;

    // valida slot
    if (!HERO_SLOTS.includes(slot as HeroSlot)) {
      return apiResponse.error('Invalid hero slot', 400);
    }

    // busca hero image do banco de dados
    const [heroImage] = await db
      .select({
        slot: heroImages.slot,
        url: heroImages.url,
        altText: heroImages.altText,
      })
      .from(heroImages)
      .where(eq(heroImages.slot, slot as HeroSlot))
      .limit(1);

    if (!heroImage) {
      return apiResponse.notFound('Hero image');
    }

    return apiResponse.success({
      slot: heroImage.slot,
      url: heroImage.url,
      altText: heroImage.altText,
    });
  } catch (error) {
    console.error('Get hero error:', error);
    return apiResponse.serverError('Failed to fetch hero image');
  }
}
