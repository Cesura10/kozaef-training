import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kozaef Training | Entrenamiento personal online",
    template: "%s | Kozaef Training",
  },
  description:
    "Calculadoras gratis, guías de entrenamiento y coaching 1:1 con plazas limitadas.",
  applicationName: "Kozaef Training",
  appleWebApp: { capable: true, title: "Kozaef", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="app-backdrop grain min-h-full flex flex-col">{children}</body>
    </html>
  );
}
