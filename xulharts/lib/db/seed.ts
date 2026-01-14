import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { heroImages, adminUsers, categorySettings, pageContent } from './schema';
import { HERO_SLOTS, GALLERY_CATEGORIES, PAGES, HOME_FIELDS, BISCUIT_FIELDS, ABOUT_FIELDS } from '@/lib/types';
import * as bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');
    console.log('📸 Creating hero image slots...');

    for (const slot of HERO_SLOTS) {
      const existing = await db.select().from(heroImages).where(eq(heroImages.slot, slot));

      if (existing.length === 0) {
        await db.insert(heroImages).values({
          slot,
          url: 'https://placehold.co/800x600/png?text=' + slot.toUpperCase().replace(/_/g, '+'),
          blobId: 'placeholder-' + slot,
          altText: `Placeholder for ${slot}`,
        });
        console.log(`  ✓ Created hero slot: ${slot}`);
      } else {
        console.log(`  ⊘ Slot already exists: ${slot}`);
      }
    }

    console.log('\n⚙️  Creating category settings...');

    // cria configurações para todas as 6 categorias
    for (const category of GALLERY_CATEGORIES) {
      const existing = await db.select().from(categorySettings).where(eq(categorySettings.category, category));

      if (existing.length === 0) {
        await db.insert(categorySettings).values({
          category,
          isPublished: false,
          comingSoonMessage: 'Em breve!',
        });
        console.log(`  ✓ Created category settings: ${category} (unpublished)`);
      } else {
        console.log(`  ⊘ Category settings already exist: ${category}`);
      }
    }

    console.log('\n📄 Creating page content fields...');

    // conteúdo da página home 
    for (const field of HOME_FIELDS) {
      const existing = await db.select().from(pageContent)
        .where(and(
          eq(pageContent.page, 'home'),
          eq(pageContent.fieldKey, field)
        ));

      if (existing.length === 0) {
        await db.insert(pageContent).values({
          page: 'home',
          fieldKey: field,
          content: '',
        });
        console.log(`  ✓ Created home field: ${field}`);
      } else {
        console.log(`  ⊘ Home field already exists: ${field}`);
      }
    }

    // conteúdo da página about
    for (const field of ABOUT_FIELDS) {
      const existing = await db.select().from(pageContent)
        .where(and(
          eq(pageContent.page, 'about'),
          eq(pageContent.fieldKey, field)
        ));

      if (existing.length === 0) {
        await db.insert(pageContent).values({
          page: 'about',
          fieldKey: field,
          content: '',
        });
        console.log(`  ✓ Created about field: ${field}`);
      } else {
        console.log(`  ⊘ About field already exists: ${field}`);
      }
    }

    // conteúdo das páginas de biscuit
    const biscuitPages = ['biscuit_pop', 'biscuit_chibi', 'biscuit_anime'] as const;
    for (const page of biscuitPages) {
      for (const field of BISCUIT_FIELDS) {
        const existing = await db.select().from(pageContent)
          .where(and(
            eq(pageContent.page, page),
            eq(pageContent.fieldKey, field)
          ));

        if (existing.length === 0) {
          await db.insert(pageContent).values({
            page,
            fieldKey: field,
            content: '',
          });
          console.log(`  ✓ Created ${page} field: ${field}`);
        } else {
          console.log(`  ⊘ ${page} field already exists: ${field}`);
        }
      }
    }

    console.log('\n👤 Creating admin user...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    }

    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, adminEmail));

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      await db.insert(adminUsers).values({
        email: adminEmail,
        passwordHash,
      });
      console.log(`  ✓ Admin user created: ${adminEmail}`);
    } else {
      console.log(`  ⊘ Admin user already exists: ${adminEmail}`);
    }

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();