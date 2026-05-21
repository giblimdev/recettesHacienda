import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ou "sqlite" / "mysql"
  }),
  emailAndPassword: {
    enabled: true, // Active l'authentification email/mot de passe
    autoSignIn: true, // Connecte l'utilisateur automatiquement après inscription
  },
  socialProviders: {
    // Optionnel : Google
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours en secondes
    updateAge: 60 * 60 * 24, // Met à jour la session toutes les 24h
  },
});
