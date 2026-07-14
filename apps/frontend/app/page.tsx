import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Welcome, {session.user.email}!</h1>
        <p className="mt-4 text-muted-foreground">You are signed in to PersonToolbox Frontend.</p>
      </div>
    </div>
  );
}
