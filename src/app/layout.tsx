import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BongCraft SMP | Bengal's Ultimate Survival Experience",
  description: "Welcome to BongCraft SMP - Bengal's Ultimate Survival Minecraft Server. Explore custom ranks, keys, coins, cosmetics, and bundles in our premium store. Join bongcraftsmp.pdhost.in:25571 today!",
  keywords: ["BongCraft", "BongCraft SMP", "Minecraft Server India", "Bengal Minecraft", "Minecraft Store", "Survival Minecraft", "Indian Minecraft Server"],
  openGraph: {
    title: "BongCraft SMP | Bengal's Ultimate Survival Experience",
    description: "Welcome to BongCraft SMP - Bengal's Ultimate Survival Minecraft Server. Explore custom ranks, keys, coins, cosmetics, and bundles in our premium store. Join bongcraftsmp.pdhost.in:25571 today!",
    type: "website",
    url: "https://bongcraft.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[#09090B] text-[#F8FAFC] antialiased overflow-x-hidden">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
