import { pgTable, text, timestamp, integer, serial, varchar, pgEnum, boolean, unique, primaryKey } from 'drizzle-orm/pg-core';

// enums para categorias e slots fixos
export const galleryCategoryEnum = pgEnum('gallery_category', [
  'biscuit_pop',
  'biscuit_chibi',
  'biscuit_anime',
  'artes_a_mao',
  'artes_digitais',
  'comissoes'
]);

export const heroSlotEnum = pgEnum('hero_slot', [
  'home_emotes',
  'home_badges',
  'home_corpo',
  'home_chibi',
  'about_main',
  'biscuit_pop_hero',
  'biscuit_chibi_hero',
  'biscuit_anime_hero'
]);

// tabela de imagens de galeria - múltiplas imagens por categoria com ordenação
export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  category: galleryCategoryEnum('category').notNull(),
  url: text('url').notNull(),
  blobId: text('blob_id').notNull(), // ID do Vercel Blob storage para deleção
  altText: text('alt_text'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// tabela de hero images - imagem única por slot (substituível)
export const heroImages = pgTable('hero_images', {
  id: serial('id').primaryKey(),
  slot: heroSlotEnum('slot').notNull().unique(), // garante apenas uma imagem por slot
  url: text('url').notNull(),
  blobId: text('blob_id').notNull(),
  altText: text('alt_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// tabela de usuários admin - para autenticação do dashboard
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// tabela de configurações de categoria - controla visibilidade das páginas
export const categorySettings = pgTable('category_settings', {
  category: galleryCategoryEnum('category').primaryKey(),
  isPublished: boolean('is_published').notNull().default(false),
  comingSoonMessage: text('coming_soon_message').default('Em breve!'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// enum para páginas disponíveis
export const pageEnum = pgEnum('page', [
  'home',
  'about',
  'biscuit_pop',
  'biscuit_chibi',
  'biscuit_anime',
  'artes_a_mao',
  'artes_digitais',
  'comissoes',
]);

// tabela de conteúdo editável das páginas
export const pageContent = pgTable('page_content', {
  id: serial('id').primaryKey(),
  page: pageEnum('page').notNull(),
  fieldKey: varchar('field_key', { length: 100 }).notNull(),
  content: text('content').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({

  uniquePageField: unique().on(table.page, table.fieldKey)
}));

// Better Auth Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt'),
});
