import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Pixtos -same your memories",
  description: "Store your photos and videost safely",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
