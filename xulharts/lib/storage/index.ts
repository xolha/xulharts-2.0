import { put, del } from '@vercel/blob';
import { validateImage } from './validation';

export interface UploadResult {
  url: string;
  blobId: string;
}

/**
 * faz upload de uma imagem para o Vercel Blob Storage
 * @param file - arquivo para upload
 * @param folder - caminho da pasta no blob storage (ex: 'gallery/biscuit_pop' ou 'hero/home_emotes')
 * @returns objeto com url e blobId
 */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  // valida imagem antes do upload
  validateImage(file);

  // faz upload para Vercel Blob
  const blob = await put(`${folder}/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true, // previne conflitos de nome
  });

  return {
    url: blob.url,
    blobId: blob.pathname,
  };
}

/**
 * deleta uma imagem do Vercel Blob Storage
 * @param blobId - pathname do blob para deletar
 */
export async function deleteImage(blobId: string): Promise<void> {
  await del(blobId);
}

// re-exporta utilitários de validação
export { validateImage, ImageValidationError } from './validation';
