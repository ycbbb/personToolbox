import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config for the frontend app (no Prisma imports).
 * Used by middleware for JWT session verification.
 */
const secret =
  process.env.NEXTAUTH_SECRET_FRONTEND?.trim() ?? process.env.NEXTAUTH_SECRET?.trim();

if (!secret) {
  throw new Error(
    "[frontend/auth.config] Neither NEXTAUTH_SECRET_FRONTEND nor NEXTAUTH_SECRET is set. " +
      "At least one must be provided. The app cannot start without a JWT signing secret."
  );
}

export const authConfig: NextAuthConfig = {
  secret,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "persontoolbox-frontend-session",
    },
  },
  providers: [], // Providers added in auth.ts (not edge-safe)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.status = (user as { status: string }).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { status: string }).status = token.status as string;
      }
      return session;
    },
    authorized() {
      return true; // We handle auth logic in middleware.ts manually
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/") && !url.startsWith("//")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) return url;
      } catch {
        // Malformed URL — fall through to deny
      }
      return baseUrl;
    },
  },
};
