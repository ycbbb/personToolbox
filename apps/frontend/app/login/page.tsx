"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sanitizeCallbackUrl } from "@packages/shared/src/redirects";
import { Button } from "@packages/ui/src/button";
import { Input } from "@packages/ui/src/input";
import { Label } from "@packages/ui/src/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  const registered = searchParams.get("registered");
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

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(callbackUrl);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {registered === "true" && (
        <div className="rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm font-medium text-success">
          Registration successful! Please sign in.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
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
        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-md border-border bg-white px-4 text-sm font-medium focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-md bg-primary text-sm font-bold uppercase tracking-[0.05em] text-white hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h1>
            <p className="mt-2 text-sm text-muted-foreground">Welcome to PersonToolbox.</p>
          </div>

          <Suspense
            fallback={
              <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
                Loading...
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-accent underline underline-offset-2 hover:text-accent/80"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
