import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/db/schema';
import { deleteImage } from '@/lib/storage';
import { apiResponse } from '@/lib/utils/response';
import { type UpdateMetadataRequest } from '@/lib/types';
import { eq } from 'drizzle-orm';

// DELETE: deleta imagem da galeria
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    // verifica autenticação
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { imageId } = await params;
    const id = parseInt(imageId, 10);

    if (isNaN(id)) {
      return apiResponse.error('Invalid image ID', 400);
    }

    // busca imagem do banco de dados
    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1);

    if (!image) {
      return apiResponse.notFound('Image');
    }

    // deleta do Blob Storage primeiro
    try {
      await deleteImage(image.blobId);
    } catch (error) {
      console.error('Failed to delete from blob storage:', error);
      // continua com deleção do DB mesmo se deleção do blob falhar
    }

    // deleta do banco de dados
    await db.delete(galleryImages).where(eq(galleryImages.id, id));

    return apiResponse.success({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return apiResponse.serverError('Failed to delete image');
  }
}

// PATCH: atualiza metadata da imagem
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    // verifica autenticação
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return apiResponse.unauthorized();
    }

    const { imageId } = await params;
    const id = parseInt(imageId, 10);

    if (isNaN(id)) {
      return apiResponse.error('Invalid image ID', 400);
    }

    // faz parse do body da requisição
    const body: UpdateMetadataRequest = await request.json();

    // atualiza imagem
    const [updatedImage] = await db
      .update(galleryImages)
      .set({
        altText: body.altText,
        updatedAt: new Date(),
      })
      .where(eq(galleryImages.id, id))
      .returning();

    if (!updatedImage) {
      return apiResponse.notFound('Image');
    }

    return apiResponse.success({
      id: updatedImage.id,
      altText: updatedImage.altText,
      updatedAt: updatedImage.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update error:', error);
    return apiResponse.serverError('Failed to update image');
  }
}
