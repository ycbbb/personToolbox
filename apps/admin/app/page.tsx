import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminHomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;
  const backofficeRole = (session.user as { backofficeRole?: string }).backofficeRole;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {session.user.email}!
        </h1>
        <p className="mt-4 text-muted-foreground">
          You are signed in to the Admin Portal.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Role: {role} | Backoffice: {backofficeRole ?? "N/A"}
        </p>
      </div>
    </div>
  );
}
