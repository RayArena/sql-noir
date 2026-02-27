import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "SQL Noir",
  description: "Solve crimes by writing real SQL queries against case databases.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <Header />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
