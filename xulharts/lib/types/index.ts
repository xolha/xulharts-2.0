// categorias de galeria (correspondentes ao enum do DB)
export const GALLERY_CATEGORIES = [
  'biscuit_pop',
  'biscuit_chibi',
  'biscuit_anime',
  'artes_a_mao',
  'artes_digitais',
  'comissoes'
] as const;

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];

// slots de hero images (correspondentes ao enum do DB)
export const HERO_SLOTS = [
  'home_emotes',
  'home_badges',
  'home_corpo',
  'home_chibi',
  'about_main',
  'biscuit_pop_hero',
  'biscuit_chibi_hero',
  'biscuit_anime_hero'
] as const;

export type HeroSlot = typeof HERO_SLOTS[number];

// tipos de resposta da API
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// tipo de imagem de galeria
export interface GalleryImage {
  id: number;
  category: GalleryCategory;
  url: string;
  altText: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// tipo de hero image
export interface HeroImage {
  id: number;
  slot: HeroSlot;
  url: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

// tipos de requisição
export interface ReorderRequest {
  imageOrders: Array<{
    id: number;
    displayOrder: number;
  }>;
}

export interface UpdateMetadataRequest {
  altText?: string;
}
