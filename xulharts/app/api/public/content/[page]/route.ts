import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { pageContent } from '@/lib/db/schema';
import { apiResponse } from '@/lib/utils/response';
import { PAGES, type Page } from '@/lib/types';
import { eq } from 'drizzle-orm';

// GET: busca todo o conteúdo de uma página
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;

    // valida página
    if (!PAGES.includes(page as Page)) {
      return apiResponse.error('Invalid page', 400);
    }

    // busca todos os campos da página
    const fields = await db
      .select({
        fieldKey: pageContent.fieldKey,
        content: pageContent.content,
        updatedAt: pageContent.updatedAt,
      })
      .from(pageContent)
      .where(eq(pageContent.page, page as Page));

    // transforma em objeto { fieldKey: content }
    const contentMap = fields.reduce((acc, field) => {
      acc[field.fieldKey] = field.content;
      return acc;
    }, {} as Record<string, string>);

    return apiResponse.success({
      page,
      content: contentMap,
    });
  } catch (error) {
    console.error('Get page content error:', error);
    return apiResponse.serverError('Failed to fetch page content');
  }
}
