import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config for the admin app (no Prisma imports).
 * Used by middleware for JWT session verification.
 */
const secret =
  process.env.NEXTAUTH_SECRET_ADMIN?.trim() ?? process.env.NEXTAUTH_SECRET?.trim();

if (!secret) {
  throw new Error(
    "[admin/auth.config] Neither NEXTAUTH_SECRET_ADMIN nor NEXTAUTH_SECRET is set. " +
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
      name: "persontoolbox-admin-session",
    },
  },
  providers: [], // Providers added in auth.ts (not edge-safe)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.status = (user as { status: string }).status;
        token.backofficeRole = (user as { backofficeRole?: string }).backofficeRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { status: string }).status = token.status as string;
        (session.user as { backofficeRole?: string }).backofficeRole = token.backofficeRole as
          | string
          | undefined;
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
