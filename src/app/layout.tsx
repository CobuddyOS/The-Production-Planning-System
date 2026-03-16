import type { Metadata } from "next";
import { Outfit, Geist, Orbitron, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Cobuddy OS | Collaborative Team Infrastructure",
  description: "The multi-tenant operation system for modern teams. Build together, faster than ever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans dark",
        geist.variable,
        outfit.variable,
        orbitron.variable,
        montserrat.variable
      )}
      suppressHydrationWarning
    >
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
