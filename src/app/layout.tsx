import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "AuraCase - Премиум аксесоари за вашите устройства",
  description: "Висококачествени аксесоари за вашите устройства. Гейминг контролери, лаптоп стойки, безжични слушалки, монитор крепежи и още.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-dark-500">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

