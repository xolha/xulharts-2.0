// regras de validação de imagem
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export function validateImage(file: File): void {
  // valida tipo do arquivo
  if (!ALLOWED_TYPES.includes(file.type as any)) {
    throw new ImageValidationError(
      `Invalid file type. Only JPEG, PNG, and WebP images are allowed. Received: ${file.type}`
    );
  }

  // valida tamanho do arquivo
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    throw new ImageValidationError(
      `File size exceeds 5MB limit. Your file is ${sizeMB}MB`
    );
  }

  // valida se arquivo tem conteúdo
  if (file.size === 0) {
    throw new ImageValidationError('File is empty');
  }
}

export { MAX_FILE_SIZE, ALLOWED_TYPES };
