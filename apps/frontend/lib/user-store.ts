/**
 * In-memory user store shared between registration and auth.
 * Replaces a real database — users survive for the lifetime of the server process.
 * Replace with Prisma DB queries when a database is connected.
 */

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // bcrypt hash
  role: "CUSTOMER" | "STAFF" | "SYSTEM";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  createdAt: Date;
}

// Seed with the existing test account so it still works after refactor
const users: StoredUser[] = [
  {
    id: "user-001",
    email: "user@test.com",
    // bcrypt hash of "password123"
    passwordHash: "$2b$10$vtEUxR2X3hF4Y.hPuRLIVuPz58gKpoMC715a.c0uqMzsVYdmVyAja",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: new Date(),
  },
];

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find((u) => u.email === email);
}

export function createUser(
  email: string,
  passwordHash: string
): StoredUser {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user: StoredUser = {
    id,
    email,
    passwordHash,
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}
