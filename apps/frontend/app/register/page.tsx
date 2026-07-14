"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@packages/ui/src/button";
import { Input } from "@packages/ui/src/input";
import { Label } from "@packages/ui/src/label";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Registration successful — redirect to login
      router.push("/login?registered=true");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Register for a PersonToolbox account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="h-12 rounded-md border-border bg-white px-4 text-sm font-medium focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="h-12 rounded-md border-border bg-white px-4 text-sm font-medium focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="h-12 rounded-md border-border bg-white px-4 text-sm font-medium focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-md bg-primary text-sm font-bold uppercase tracking-[0.05em] text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-accent underline underline-offset-2 hover:text-accent/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
