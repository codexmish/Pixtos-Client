import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Pixtos -Save Your Memories",
  description: "Store your photos and videost safely",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "text-slate-800", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster/>
        </body>
    </html>
  );
}
