# API Documentation - Xulharts Backend

## Índice
- [Autenticação](#autenticação)
- [Endpoints Públicos](#endpoints-públicos)
  - [Galerias](#galerias-público)
  - [Hero Images](#hero-images-público)
- [Endpoints Admin](#endpoints-admin-protegidos)
  - [Galeria Upload](#admin-upload-galeria)
  - [Galeria Reordenar](#admin-reordenar-galeria)
  - [Galeria Deletar](#admin-deletar-imagem-galeria)
  - [Galeria Editar Metadata](#admin-editar-metadata-galeria)
  - [Hero Image Substituir](#admin-substituir-hero-image)
  - [Publicar/Despublicar Categoria](#admin-publicardespublicar-categoria)

---

## Autenticação

### Login
```typescript
POST /api/auth/sign-in
Content-Type: application/json

Body:
{
  "email": "xulharts@gmail.com",
  "password": "sua-senha"
}

Response (Success):
{
  "session": {
    "id": "session_id",
    "userId": "user_id",
    "expiresAt": "2024-01-20T00:00:00.000Z"
  },
  "user": {
    "id": "user_id",
    "email": "xulharts@gmail.com"
  }
}
```

### Logout
```typescript
POST /api/auth/sign-out

Response:
{
  "success": true
}
```

### Verificar Sessão
```typescript
GET /api/auth/session

Response (Authenticated):
{
  "session": {
    "id": "session_id",
    "userId": "user_id",
    "expiresAt": "2024-01-20T00:00:00.000Z"
  },
  "user": {
    "id": "user_id",
    "email": "xulharts@gmail.com"
  }
}

Response (Not Authenticated):
null
```

---

## Endpoints Públicos

### Galerias (Público)

#### Buscar Imagens de uma Galeria
```typescript
GET /api/public/gallery/[category]
```

**Categorias disponíveis:**
- `biscuit_pop`
- `biscuit_chibi`
- `biscuit_anime`
- `artes_a_mao`
- `artes_digitais`
- `comissoes`

**Exemplo (Categoria Publicada):**
```typescript
GET /api/public/gallery/biscuit_pop

Response:
{
  "success": true,
  "data": {
    "category": "biscuit_pop",
    "isPublished": true,
    "images": [
      {
        "id": 1,
        "url": "https://blob.vercel-storage.com/...",
        "altText": "Descrição da imagem",
        "displayOrder": 0
      },
      {
        "id": 2,
        "url": "https://blob.vercel-storage.com/...",
        "altText": "Outra descrição",
        "displayOrder": 1
      }
    ]
  }
}
```

**Exemplo (Categoria Não Publicada - "Em Breve"):**
```typescript
GET /api/public/gallery/biscuit_chibi

Response:
{
  "success": true,
  "data": {
    "category": "biscuit_chibi",
    "isPublished": false,
    "message": "Em breve!",
    "images": []
  }
}
```

**Uso no Frontend:**
```typescript
// Exemplo com fetch
const fetchGallery = async (category: string) => {
  const response = await fetch(`/api/public/gallery/${category}`);
  const { data } = await response.json();

  if (!data.isPublished) {
    // Mostrar mensagem "em breve"
    return { comingSoon: true, message: data.message };
  }

  // Retornar imagens normalmente
  return { comingSoon: false, images: data.images };
};

// Exemplo de uso
const result = await fetchGallery('biscuit_pop');
if (result.comingSoon) {
  console.log(result.message); // "Em breve!"
} else {
  console.log(result.images); // Array de imagens
}
```

---

### Hero Images (Público)

#### Buscar Hero Image por Slot
```typescript
GET /api/public/hero/[slot]
```

**Slots disponíveis:**
- `home_emotes` - Home: Emotes
- `home_badges` - Home: Badges
- `home_corpo` - Home: Corpo
- `home_chibi` - Home: Chibi
- `about_main` - Sobre: Imagem Principal
- `biscuit_pop_hero` - Biscuit Pop: Hero
- `biscuit_chibi_hero` - Biscuit Chibi: Hero
- `biscuit_anime_hero` - Biscuit Anime: Hero

**Exemplo:**
```typescript
GET /api/public/hero/home_emotes

Response:
{
  "success": true,
  "data": {
    "slot": "home_emotes",
    "url": "https://blob.vercel-storage.com/...",
    "altText": "Descrição da imagem"
  }
}
```

**Uso no Frontend:**
```typescript
// Exemplo com fetch
const fetchHeroImage = async (slot: string) => {
  const response = await fetch(`/api/public/hero/${slot}`);
  const data = await response.json();
  return data.data; // { slot, url, altText }
};

// Exemplo de uso
const heroImage = await fetchHeroImage('home_emotes');
```

---

## Endpoints Admin (Protegidos)

**Nota:** Todos os endpoints admin requerem autenticação. Certifique-se de que o usuário está logado antes de fazer as requisições.

---

### Admin: Upload Galeria

#### Upload de Imagem para Galeria
```typescript
POST /api/admin/gallery/[category]/upload
Content-Type: multipart/form-data
```

**Parâmetros:**
- `category`: Categoria da galeria (biscuit_pop, biscuit_chibi, etc.)

**Form Data:**
- `file`: Arquivo de imagem (JPEG, PNG ou WebP, máx. 5MB)
- `altText` (opcional): Texto alternativo para a imagem

**Exemplo:**
```typescript
const uploadImage = async (category: string, file: File, altText?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) formData.append('altText', altText);

  const response = await fetch(`/api/admin/gallery/${category}/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

// Uso
const result = await uploadImage('biscuit_pop', imageFile, 'Meu biscuit pop favorito');
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "category": "biscuit_pop",
    "url": "https://blob.vercel-storage.com/...",
    "altText": "Meu biscuit pop favorito",
    "displayOrder": 4,
    "createdAt": "2024-01-14T12:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit. Your file is 7.2MB"
}
```

---

### Admin: Reordenar Galeria

#### Reordenar Imagens na Galeria (Drag-and-Drop)
```typescript
PATCH /api/admin/gallery/[category]/reorder
Content-Type: application/json
```

**Body:**
```json
{
  "imageOrders": [
    { "id": 1, "displayOrder": 0 },
    { "id": 3, "displayOrder": 1 },
    { "id": 2, "displayOrder": 2 }
  ]
}
```

**Exemplo:**
```typescript
const reorderImages = async (category: string, imageOrders: Array<{ id: number; displayOrder: number }>) => {
  const response = await fetch(`/api/admin/gallery/${category}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageOrders }),
  });

  return response.json();
};

// Uso (após drag-and-drop)
const newOrder = [
  { id: 1, displayOrder: 0 },
  { id: 3, displayOrder: 1 },
  { id: 2, displayOrder: 2 },
];
await reorderImages('biscuit_pop', newOrder);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Images reordered successfully"
  }
}
```

---

### Admin: Deletar Imagem Galeria

#### Deletar Imagem da Galeria
```typescript
DELETE /api/admin/gallery/image/[imageId]
```

**Exemplo:**
```typescript
const deleteImage = async (imageId: number) => {
  const response = await fetch(`/api/admin/gallery/image/${imageId}`, {
    method: 'DELETE',
  });

  return response.json();
};

// Uso
await deleteImage(5);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully"
  }
}
```

---

### Admin: Editar Metadata Galeria

#### Editar Texto Alternativo
```typescript
PATCH /api/admin/gallery/image/[imageId]
Content-Type: application/json
```

**Body:**
```json
{
  "altText": "Nova descrição da imagem"
}
```

**Exemplo:**
```typescript
const updateAltText = async (imageId: number, altText: string) => {
  const response = await fetch(`/api/admin/gallery/image/${imageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ altText }),
  });

  return response.json();
};

// Uso
await updateAltText(5, 'Descrição atualizada');
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "altText": "Descrição atualizada",
    "updatedAt": "2024-01-14T13:00:00.000Z"
  }
}
```

---

### Admin: Substituir Hero Image

#### Substituir Hero Image
```typescript
PUT /api/admin/hero/[slot]
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Arquivo de imagem (JPEG, PNG ou WebP, máx. 5MB)
- `altText` (opcional): Texto alternativo

**Exemplo:**
```typescript
const replaceHeroImage = async (slot: string, file: File, altText?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) formData.append('altText', altText);

  const response = await fetch(`/api/admin/hero/${slot}`, {
    method: 'PUT',
    body: formData,
  });

  return response.json();
};

// Uso
await replaceHeroImage('home_emotes', newFile, 'Novo emote');
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slot": "home_emotes",
    "url": "https://blob.vercel-storage.com/...",
    "altText": "Novo emote",
    "updatedAt": "2024-01-14T14:00:00.000Z"
  }
}
```

---

### Admin: Publicar/Despublicar Categoria

#### Alternar Status de Publicação de uma Categoria
```typescript
PATCH /api/admin/category/[category]
```

**Descrição:**
Alterna o estado de publicação de uma categoria entre publicada e não publicada. Quando uma categoria está despublicada, o endpoint público retorna uma mensagem "Em breve!" ao invés das imagens.

**Uso no Admin:**
Use este endpoint para controlar quando as páginas de galeria ficam visíveis para o público. Perfeito para preparar conteúdo antes de lançar uma nova categoria.

**Exemplo:**
```typescript
const togglePublish = async (category: string) => {
  const response = await fetch(`/api/admin/category/${category}`, {
    method: 'PATCH',
  });

  return response.json();
};

// Uso - alterna entre publicado/despublicado
await togglePublish('biscuit_chibi');
```

**Response (Categoria Publicada):**
```json
{
  "success": true,
  "data": {
    "category": "biscuit_chibi",
    "isPublished": true,
    "comingSoonMessage": "Em breve!",
    "updatedAt": "2024-01-14T15:00:00.000Z"
  }
}
```

**Response (Categoria Despublicada):**
```json
{
  "success": true,
  "data": {
    "category": "biscuit_chibi",
    "isPublished": false,
    "comingSoonMessage": "Em breve!",
    "updatedAt": "2024-01-14T15:00:00.000Z"
  }
}
```

**Exemplo de UI Admin com Toggle:**
```typescript
'use client';

import { useState } from 'react';

export function CategoryPublishToggle({ category, initialState }: {
  category: string;
  initialState: boolean;
}) {
  const [isPublished, setIsPublished] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/category/${category}`, {
        method: 'PATCH',
      });

      const { data } = await response.json();
      setIsPublished(data.isPublished);

      alert(data.isPublished ? 'Categoria publicada!' : 'Categoria despublicada!');
    } catch (error) {
      alert('Erro ao alternar publicação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={isPublished ? 'bg-green-500' : 'bg-gray-500'}
    >
      {loading ? 'Processando...' : isPublished ? '✓ Publicado' : '○ Despublicado'}
    </button>
  );
}
```

---

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "success": false,
  "error": "Mensagem de erro detalhada"
}
```

### Códigos de Status HTTP:

| Código | Significado |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request (dados inválidos) |
| 401 | Unauthorized (não autenticado) |
| 404 | Not Found (recurso não encontrado) |
| 500 | Internal Server Error |

### Exemplos de Erros Comuns:

**Arquivo muito grande:**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit. Your file is 7.2MB"
}
```

**Tipo de arquivo inválido:**
```json
{
  "success": false,
  "error": "Invalid file type: image/gif. Only JPEG, PNG, and WebP images are allowed."
}
```

**Não autenticado:**
```json
{
  "success": false,
  "error": "Unauthorized. Please login to access this resource."
}
```

**Categoria inválida:**
```json
{
  "success": false,
  "error": "Invalid gallery category"
}
```

---

## Tipos TypeScript

Para usar no seu frontend, copie estes tipos:

```typescript
// Categorias de galeria
export type GalleryCategory =
  | 'biscuit_pop'
  | 'biscuit_chibi'
  | 'biscuit_anime'
  | 'artes_a_mao'
  | 'artes_digitais'
  | 'comissoes';

// Slots de hero images
export type HeroSlot =
  | 'home_emotes'
  | 'home_badges'
  | 'home_corpo'
  | 'home_chibi'
  | 'about_main'
  | 'biscuit_pop_hero'
  | 'biscuit_chibi_hero'
  | 'biscuit_anime_hero';

// Imagem de galeria (resposta pública)
export interface GalleryImage {
  id: number;
  url: string;
  altText: string | null;
  displayOrder: number;
}

// Hero image (resposta pública)
export interface HeroImage {
  slot: HeroSlot;
  url: string;
  altText: string | null;
}

// Resposta de galeria (publicada)
export interface GalleryResponsePublished {
  category: GalleryCategory;
  isPublished: true;
  images: GalleryImage[];
}

// Resposta de galeria (não publicada)
export interface GalleryResponseUnpublished {
  category: GalleryCategory;
  isPublished: false;
  message: string;
  images: [];
}

// Resposta de galeria (união dos dois tipos)
export type GalleryResponse = GalleryResponsePublished | GalleryResponseUnpublished;

// Configuração de categoria
export interface CategorySettings {
  category: GalleryCategory;
  isPublished: boolean;
  comingSoonMessage: string;
  updatedAt: string;
}

// API Response genérica
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

## Exemplos Práticos de Integração

### Exemplo 1: Página de Galeria Pública (com suporte a "Em Breve")

```typescript
// app/src/site/gallery/[category]/page.tsx
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function GalleryPage({ params }: PageProps) {
  const { category } = await params;

  // Fetch gallery images
  const galleryRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/gallery/${category}`,
    { cache: 'no-store' } // ou use revalidate para ISR
  );

  if (!galleryRes.ok) {
    notFound();
  }

  const { data } = await galleryRes.json();

  // Se categoria não está publicada, mostrar "em breve"
  if (!data.isPublished) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{data.message}</h1>
          <p className="text-gray-600">Esta categoria ainda não está disponível.</p>
        </div>
      </div>
    );
  }

  // Fetch hero image
  const heroRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/hero/${category}_hero`
  );

  const heroData = heroRes.ok ? (await heroRes.json()).data : null;

  return (
    <div>
      {/* Hero Image */}
      {heroData && (
        <img
          src={heroData.url}
          alt={heroData.altText || category}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {data.images.map((image: any) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.altText || ''}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>
    </div>
  );
}
```

### Exemplo 2: Upload de Imagem (Admin)

```typescript
// app/src/admin/galleries/[category]/page.tsx
'use client';

import { useState } from 'react';

export default function AdminGalleryPage() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', 'Descrição da imagem');

    try {
      const response = await fetch('/api/admin/gallery/biscuit_pop/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Upload realizado com sucesso!');
        // Recarregar lista de imagens
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      alert('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Enviando...</p>}
    </div>
  );
}
```

### Exemplo 3: Home Page com Hero Images

```typescript
// app/src/site/page.tsx
export default async function HomePage() {
  // Fetch all 4 hero images for home
  const slots = ['home_emotes', 'home_badges', 'home_corpo', 'home_chibi'];

  const heroImages = await Promise.all(
    slots.map(async (slot) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/public/hero/${slot}`
      );
      if (!res.ok) return null;
      const { data } = await res.json();
      return data;
    })
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {heroImages.map((hero, index) =>
        hero ? (
          <img
            key={hero.slot}
            src={hero.url}
            alt={hero.altText || slots[index]}
            className="w-full aspect-square object-cover"
          />
        ) : null
      )}
    </div>
  );
}
```

---

## Scripts Úteis

### Scripts no package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx --env-file=.env.local lib/db/seed.ts"
  }
}
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Visualizar banco de dados
npm run db:studio

# Re-seed database
npm run db:seed

# Gerar nova migration após alterar schema
npm run db:generate
npm run db:migrate
```

---

## Considerações de Segurança

1. **Autenticação**: Todos os endpoints `/api/admin/*` requerem autenticação via Better Auth
2. **Validação de Imagens**:
   - Tipos permitidos: JPEG, PNG, WebP
   - Tamanho máximo: 5MB
3. **CORS**: Configure CORS adequadamente em produção
4. **Rate Limiting**: Considere adicionar rate limiting em produção
5. **Env Variables**: Nunca commit `.env.local` no git

---

## Sistema de Publicação de Categorias

### Como Funciona

O sistema de publicação permite controlar a visibilidade das categorias de galeria:

1. **Por Padrão**: Todas as categorias são criadas como **despublicadas** (isPublished: false)
2. **Mensagem "Em Breve"**: Categorias despublicadas retornam a mensagem "Em breve!" para o público
3. **Controle Admin**: Use o endpoint `PATCH /api/admin/category/[category]` para alternar o status
4. **Preparação de Conteúdo**: Upload imagens enquanto a categoria está despublicada, depois publique quando estiver pronto

### Workflow Recomendado

```
1. Categoria criada (despublicada por padrão)
   ↓
2. Admin faz upload de várias imagens
   ↓
3. Admin organiza ordem das imagens (drag-and-drop)
   ↓
4. Admin revisa conteúdo
   ↓
5. Admin clica em "Publicar" → Categoria fica visível para o público
   ↓
6. Público vê galeria completa
```

### Estado Inicial das Categorias

Após rodar o seed (`npm run db:seed`), todas as 6 categorias são criadas como **despublicadas**:

| Categoria | Estado Inicial | Mensagem |
|-----------|---------------|----------|
| biscuit_pop | Despublicada | "Em breve!" |
| biscuit_chibi | Despublicada | "Em breve!" |
| biscuit_anime | Despublicada | "Em breve!" |
| artes_a_mao | Despublicada | "Em breve!" |
| artes_digitais | Despublicada | "Em breve!" |
| comissoes | Despublicada | "Em breve!" |

### Verificar Status de Publicação

Para verificar o status atual de uma categoria no banco de dados, você pode usar o Drizzle Studio:

```bash
npm run db:studio
```

Ou consultar diretamente via API no admin (você precisará criar um endpoint GET se desejar).

---

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Verifique se o arquivo `.env.local` existe
- Confirme que a variável `DATABASE_URL` está preenchida

### "BLOB_READ_WRITE_TOKEN is required"
- Configure o Vercel Blob Storage
- Adicione o token ao `.env.local`

### "Unauthorized" ao acessar rotas admin
- Faça login primeiro via `/api/auth/sign-in`
- Verifique se o cookie de sessão está sendo enviado

### Imagens não aparecem
- Verifique se a URL do Blob Storage está acessível
- Confirme que as imagens foram uploadadas com sucesso
- Cheque se há erros de CORS

---

## Suporte

Para dúvidas ou problemas, verifique:
1. Este arquivo de documentação
2. O plano de implementação em `C:\Users\julia\.claude\plans\squishy-seeking-pony.md`
3. Os tipos TypeScript em `lib/types/index.ts`