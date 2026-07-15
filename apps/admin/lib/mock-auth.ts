/**
 * Mock authorize function for admin — uses hardcoded test accounts.
 * Replace with real Prisma DB queries when a database is available.
 * Only allows STAFF/SYSTEM roles.
 */

interface MockStaffUser {
  id: string;
  email: string;
  passwordHash: string;
  role: "STAFF" | "SYSTEM";
  status: "ACTIVE" | "SUSPENDED";
  backofficeRole: string;
}

// Hardcoded test accounts — replace with DB queries in production
const MOCK_STAFF_USERS: MockStaffUser[] = [
  {
    id: "staff-001",
    email: "admin@test.com",
    passwordHash: "admin123",
    role: "STAFF",
    status: "ACTIVE",
    backofficeRole: "SYSTEM_ADMIN",
  },
];

export async function authorizeAdmin(
  credentials: { email: string; password: string } | null | undefined
): Promise<{
  id: string;
  email: string;
  role: string;
  status: string;
  backofficeRole: string;
} | null> {
  if (!credentials?.email || !credentials?.password) return null;

  const email = credentials.email.toLowerCase().trim();
  const password = credentials.password;

  if (!email) return null;

  const user = MOCK_STAFF_USERS.find((u) => u.email === email);
  if (!user) return null;

  // Plain-text comparison (mock only — use bcrypt in production)
  if (password !== user.passwordHash) return null;

  if (user.status === "SUSPENDED") return null;

  // Admin: only STAFF/SYSTEM roles
  if (user.role !== "STAFF" && user.role !== "SYSTEM") return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    backofficeRole: user.backofficeRole,
  };
}
