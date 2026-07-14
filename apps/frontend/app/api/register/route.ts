import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod/v4";
import { findUserByEmail, createUser } from "@/lib/user-store";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = findUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (cost factor 10)
    const passwordHash = await hash(password, 10);

    // Create user
    const user = createUser(normalizedEmail, passwordHash);

    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
