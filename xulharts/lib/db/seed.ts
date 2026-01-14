/**
 * Database seed script
 * Populates the database with initial data:
 * - 8 empty hero slots
 * - Admin user
 */

// IMPORTANT: Load env vars BEFORE any imports that use them
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { heroImages, adminUsers, categorySettings } from './schema';
import { HERO_SLOTS, GALLERY_CATEGORIES } from '@/lib/types';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // ========================================================================
    // Seed Hero Image Slots
    // ========================================================================
    console.log('📸 Creating hero image slots...');

    // Create placeholder hero images for all 8 slots
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

    // ========================================================================
    // Seed Category Settings
    // ========================================================================
    console.log('\n⚙️  Creating category settings...');

    // cria configurações para todas as 6 categorias (todas despublicadas por padrão)
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

    // ========================================================================
    // Seed Admin User
    // ========================================================================
    console.log('\n👤 Creating admin user...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    }

    // Check if admin already exists
    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, adminEmail));

    if (existingAdmin.length === 0) {
      // Hash password
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      // Insert admin user
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

// Run seed
seed();