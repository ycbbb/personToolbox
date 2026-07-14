/**
 * Mock authorize function for frontend — uses in-memory user store + bcrypt.
 * Replace with real Prisma DB queries when a database is available.
 */

import { compare } from "bcryptjs";
import { findUserByEmail } from "./user-store";

export async function authorizeFrontend(
  credentials: { email: string; password: string } | null | undefined
): Promise<{
  id: string;
  email: string;
  role: string;
  status: string;
} | null> {
  if (!credentials?.email || !credentials?.password) return null;

  const email = credentials.email.toLowerCase().trim();
  const password = credentials.password;

  if (!email) return null;

  const user = findUserByEmail(email);
  if (!user) return null;

  // bcrypt comparison
  const isValid = await compare(password, user.passwordHash);
  if (!isValid) return null;

  if (user.status === "SUSPENDED") return null;

  // Frontend: only CUSTOMER role
  if (user.role !== "CUSTOMER") return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}
