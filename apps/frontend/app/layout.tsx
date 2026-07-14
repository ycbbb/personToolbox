import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonToolbox",
  description: "PersonToolbox Frontend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en" className="scroll-smooth" nonce={nonce || undefined}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
