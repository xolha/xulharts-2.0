import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { user, account, session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "password123";

  try {
    // Remove usuário existente se houver (para recriar com hash correto)
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      console.log("🔄 Usuário existente encontrado, recriando...");
      await db.delete(session).where(eq(session.userId, existingUser.id));
      await db.delete(account).where(eq(account.userId, existingUser.id));
      await db.delete(user).where(eq(user.id, existingUser.id));
    }

    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Admin",
      },
    });

    console.log(`✅ Admin criado com sucesso!`);
    console.log(`   Email: ${email}`);
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();
