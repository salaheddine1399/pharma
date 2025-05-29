import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const inter = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pharmintex - Analyse des Interactions Médicamenteuses",
  description:
    "Votre outil d'analyse des médicaments et interactions médicamenteuses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
