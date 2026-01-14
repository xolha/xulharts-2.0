import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { pageContent } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { PAGES, type Page } from '@/lib/types';
import { eq, and } from 'drizzle-orm';

// PATCH: atualiza conteúdo de um campo específico de uma página
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ page: string; fieldKey: string }> }
) {
  try {
    // verifica autenticação
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { page, fieldKey } = await params;

    // valida página
    if (!PAGES.includes(page as Page)) {
      return apiResponse.error('Invalid page', 400);
    }

    // pega conteúdo do body
    const body = await request.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return apiResponse.error('Content must be a string', 400);
    }

    // busca campo existente
    const [existingField] = await db
      .select()
      .from(pageContent)
      .where(and(
        eq(pageContent.page, page as Page),
        eq(pageContent.fieldKey, fieldKey)
      ))
      .limit(1);

    if (!existingField) {
      return apiResponse.notFound('Content field');
    }

    // atualiza conteúdo
    const [updatedContent] = await db
      .update(pageContent)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(and(
        eq(pageContent.page, page as Page),
        eq(pageContent.fieldKey, fieldKey)
      ))
      .returning();

    return apiResponse.success({
      id: updatedContent.id,
      page: updatedContent.page,
      fieldKey: updatedContent.fieldKey,
      content: updatedContent.content,
      updatedAt: updatedContent.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update content error:', error);
    return apiResponse.serverError('Failed to update content');
  }
}
