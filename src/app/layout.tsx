import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyPost - Social Media Management",
  description: "Schedule and publish posts to multiple social media platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
